import { Pedido, type EstadoPedido } from "../../domain/entities/Pedido";
import { DetallePedido } from "../../domain/entities/DetallePedido";
import { Producto, type Categoria } from "../../domain/entities/Producto";
import type { PedidoRepository } from "../../application/ports/PedidoRepository";

interface PedidoDTO {
  id: string; creadoEn: string; estado: EstadoPedido;
  detalles: { producto: { id:string; nombre:string; descripcion:string; precio:number; categoria:Categoria; imagen:string; permiteInstrucciones:boolean }; cantidad:number; instrucciones:string }[];
}
export class LocalStoragePedidoRepository implements PedidoRepository {
  constructor(private readonly storage: Storage = localStorage, private readonly key = "cafeu.pedido.v2") {}
  async guardar(pedido: Pedido): Promise<void> { this.storage.setItem(this.key, JSON.stringify(this.serializar(pedido))); }
  async obtenerBorrador(): Promise<Pedido | null> {
    const p = await this.obtener();
    return p?.estado === "BORRADOR" ? p : null;
  }
  async obtenerPorId(id: string): Promise<Pedido | null> {
    const p = await this.obtener();
    return p?.id === id ? p : null;
  }
  async eliminarBorrador(): Promise<void> {
    const p = await this.obtenerBorrador();
    if (p) this.storage.removeItem(this.key);
  }
  private async obtener(): Promise<Pedido | null> {
    const raw = this.storage.getItem(this.key);
    if (!raw) return null;
    try {
      const dto = JSON.parse(raw) as PedidoDTO;
      const detalles = dto.detalles.map(d => new DetallePedido({
        producto: new Producto(d.producto), cantidad: d.cantidad, instrucciones: d.instrucciones
      }));
      return new Pedido(dto.id, detalles, dto.estado, dto.creadoEn);
    } catch {
      this.storage.removeItem(this.key);
      throw new Error("No se pudo recuperar el pedido guardado. Se limpió el dato local inválido.");
    }
  }
  private serializar(p: Pedido): PedidoDTO {
    return {
      id:p.id, creadoEn:p.creadoEn, estado:p.estado,
      detalles:p.detalles.map(d => ({
        producto:{ id:d.producto.id, nombre:d.producto.nombre, descripcion:d.producto.descripcion,
          precio:d.producto.precio, categoria:d.producto.categoria, imagen:d.producto.imagen,
          permiteInstrucciones:d.producto.permiteInstrucciones },
        cantidad:d.cantidad, instrucciones:d.instrucciones
      }))
    };
  }
}