import { Pedido } from "../../domain/entities/Pedido";
import { DetallePedido } from "../../domain/entities/DetallePedido";
import type { Producto } from "../../domain/entities/Producto";
import type { PedidoRepository } from "../ports/PedidoRepository";
import type { ProductoRepository } from "../ports/ProductoRepository";
import { buscarProductos } from "../../domain/services/busqueda";

export class PedidoUseCases {
  constructor(private readonly pedidos: PedidoRepository, private readonly productos: ProductoRepository,
    private readonly crearId: () => string = () => `CU-${Date.now().toString(36).toUpperCase()}`) {}

  async buscarProducto(consulta: string): Promise<Producto[]> { return buscarProductos(await this.productos.listar(), consulta); }
  async listarProductos(): Promise<Producto[]> { return this.productos.listar(); }
  async agregarAlCarrito(productoId: string, cantidad = 1, instrucciones = ""): Promise<Pedido> {
    const producto = (await this.productos.listar()).find(p => p.id === productoId);
    if (!producto) throw new Error("No encontramos ese producto en el menú.");
    const pedido = await this.obtenerOCrear();
    pedido.agregar(new DetallePedido({ producto, cantidad, instrucciones }));
    await this.pedidos.guardar(pedido);
    return pedido;
  }
  async modificarCantidad(indice: number, cantidad: number): Promise<Pedido> {
    const pedido = await this.requerirBorrador();
    pedido.cambiarCantidad(indice, cantidad);
    await this.pedidos.guardar(pedido);
    return pedido;
  }
  async eliminarProducto(indice: number): Promise<{ pedido: Pedido; eliminado: DetallePedido }> {
    const pedido = await this.requerirBorrador();
    const eliminado = pedido.eliminar(indice);
    await this.pedidos.guardar(pedido);
    return { pedido, eliminado };
  }
  async deshacerEliminacion(detalle: DetallePedido): Promise<Pedido> {
    const pedido = await this.requerirBorrador();
    pedido.restaurar(detalle);
    await this.pedidos.guardar(pedido);
    return pedido;
  }
  async obtenerPedido(): Promise<Pedido | null> { return this.pedidos.obtenerBorrador(); }
  async confirmarPedido(): Promise<Pedido> {
    const pedido = await this.requerirBorrador();
    pedido.confirmar();
    await this.pedidos.guardar(pedido);
    return pedido;
  }
  async cancelarPedido(id: string): Promise<Pedido> {
    const pedido = await this.pedidos.obtenerPorId(id);
    if (!pedido) throw new Error("No encontramos el pedido que deseas cancelar.");
    pedido.cancelar();
    await this.pedidos.guardar(pedido);
    return pedido;
  }
  async limpiarPedidoCancelado(): Promise<void> { await this.pedidos.eliminarBorrador(); }
  private async obtenerOCrear(): Promise<Pedido> {
    return (await this.pedidos.obtenerBorrador()) ?? new Pedido(this.crearId());
  }
  private async requerirBorrador(): Promise<Pedido> {
    const pedido = await this.pedidos.obtenerBorrador();
    if (!pedido) throw new Error("No existe un pedido editable. Inicia uno nuevo desde el menú.");
    return pedido;
  }
}