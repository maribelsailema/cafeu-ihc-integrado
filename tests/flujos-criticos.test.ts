import { describe, it, expect, beforeEach } from "vitest";
import { PedidoUseCases } from "../src/application/use-cases/PedidoUseCases";
import { CatalogoLocal } from "../src/infrastructure/catalogo/CatalogoLocal";
import type { Pedido } from "../src/domain/entities/Pedido";
import type { PedidoRepository } from "../src/application/ports/PedidoRepository";

class MemoriaPedidoRepository implements PedidoRepository {
  private pedidos = new Map<string, Pedido>();
  private borradorId: string | null = null;

  async guardar(pedido: Pedido): Promise<void> {
    this.pedidos.set(pedido.id, pedido);
    if (pedido.estado === "BORRADOR") {
      this.borradorId = pedido.id;
    } else if (this.borradorId === pedido.id) {
      this.borradorId = null;
    }
  }

  async obtenerBorrador(): Promise<Pedido | null> {
    if (!this.borradorId) return null;
    const pedido = this.pedidos.get(this.borradorId) ?? null;
    return pedido?.estado === "BORRADOR" ? pedido : null;
  }

  async obtenerPorId(id: string): Promise<Pedido | null> {
    return this.pedidos.get(id) ?? null;
  }

  async eliminarBorrador(): Promise<void> {
    if (this.borradorId) {
      this.pedidos.delete(this.borradorId);
      this.borradorId = null;
    }
  }
}

describe("Pruebas funcionales críticas - CaféU 2.0 (T1, T2 y T3)", () => {
  let repoPedidos: MemoriaPedidoRepository;
  let casos: PedidoUseCases;

  beforeEach(() => {
    repoPedidos = new MemoriaPedidoRepository();
    casos = new PedidoUseCases(repoPedidos, new CatalogoLocal(), () => "CU-TEST-01");
  });

  it("T1: Busca un producto sin distinguir tildes ni mayúsculas y lo agrega al carrito con cantidad 2", async () => {
    // Búsqueda tolerante a tildes y mayúsculas sobre CatalogoLocal real
    const resultadosCafe = await casos.buscarProducto("cafe");
    expect(resultadosCafe.some((p) => p.id === "americano")).toBe(true);

    const resultadosSanduche = await casos.buscarProducto("SANDUCHE");
    expect(resultadosSanduche).toHaveLength(1);
    expect(resultadosSanduche[0].nombre).toBe("Sánduche");

    // Agregar Café americano con cantidad 2 ($1.50 x 2 = $3.00)
    const productoObjetivo = resultadosCafe.find((p) => p.id === "americano")!;
    const pedido = await casos.agregarAlCarrito(productoObjetivo.id, 2);

    expect(pedido.detalles).toHaveLength(1);
    expect(pedido.detalles[0].producto.nombre).toBe("Café americano");
    expect(pedido.cantidadItems).toBe(2);
    expect(pedido.total).toBe(3.0);
  });

  it("T2: Modifica la cantidad en el carrito a 3, verifica el recálculo del total y rechaza cantidades inválidas", async () => {
    await casos.agregarAlCarrito("americano", 2); // $3.00
    await casos.agregarAlCarrito("galleta", 1);   // $1.25 -> total inicial $4.25

    // Modificar Café americano (índice 0) de 2 a 3 unidades -> $4.50 + $1.25 = $5.75
    const pedidoActualizado = await casos.modificarCantidad(0, 3);

    expect(pedidoActualizado.detalles[0].cantidad).toBe(3);
    expect(pedidoActualizado.detalles[0].subtotal).toBe(4.5);
    expect(pedidoActualizado.cantidadItems).toBe(4);
    expect(pedidoActualizado.total).toBe(5.75);

    // Validar reglas de negocio: cantidad 0 o > 99 deben ser rechazadas
    await expect(casos.modificarCantidad(0, 0)).rejects.toThrow();
    await expect(casos.modificarCantidad(0, 100)).rejects.toThrow();
  });

  it("T3: Elimina un producto del carrito, lo recupera con Deshacer y confirma el pedido", async () => {
    await casos.agregarAlCarrito("americano", 3); // $4.50
    await casos.agregarAlCarrito("sanduche", 1);  // $2.75 -> total $7.25

    // 1. Eliminar Sánduche (índice 1)
    const { pedido: trasEliminar, eliminado } = await casos.eliminarProducto(1);
    expect(eliminado.producto.id).toBe("sanduche");
    expect(trasEliminar.detalles).toHaveLength(1);
    expect(trasEliminar.total).toBe(4.5);

    // 2. Recuperar mediante Deshacer
    const trasRecuperar = await casos.deshacerEliminacion(eliminado);
    expect(trasRecuperar.detalles).toHaveLength(2);
    expect(trasRecuperar.cantidadItems).toBe(4);
    expect(trasRecuperar.total).toBe(7.25);

    // 3. Confirmar el pedido y comprobar estado final + código de pedido
    const confirmado = await casos.confirmarPedido();
    expect(confirmado.id).toBe("CU-TEST-01");
    expect(confirmado.estado).toBe("CONFIRMADO");
    expect(confirmado.total).toBe(7.25);

    // 4. Comprobar que el borrador ya no es editable tras confirmar
    expect(await casos.obtenerPedido()).toBeNull();
    await expect(casos.modificarCantidad(0, 1)).rejects.toThrow();
  });

  it("Permite cancelar un pedido confirmado por su ID y refleja el estado CANCELADO", async () => {
    await casos.agregarAlCarrito("capuchino", 1);
    const confirmado = await casos.confirmarPedido();
    expect(confirmado.estado).toBe("CONFIRMADO");

    const cancelado = await casos.cancelarPedido(confirmado.id);
    expect(cancelado.estado).toBe("CANCELADO");
  });
});
