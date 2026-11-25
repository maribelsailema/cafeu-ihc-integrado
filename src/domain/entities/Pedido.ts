import { DetallePedido } from "./DetallePedido";
import { redondear } from "./Producto";

export type EstadoPedido = "BORRADOR" | "CONFIRMADO" | "CANCELADO";
export class Pedido {
  readonly id: string;
  readonly creadoEn: string;
  private _detalles: DetallePedido[];
  private _estado: EstadoPedido;

  constructor(id: string, detalles: DetallePedido[] = [], estado: EstadoPedido = "BORRADOR", creadoEn = new Date().toISOString()) {
    if (!id.trim()) throw new Error("El pedido requiere un identificador.");
    this.id = id;
    this._detalles = [...detalles];
    this._estado = estado;
    this.creadoEn = creadoEn;
    if (estado !== "BORRADOR" && detalles.length === 0) throw new Error("Un pedido sin productos no puede confirmarse ni cancelarse.");
  }
  get detalles(): readonly DetallePedido[] { return this._detalles; }
  get estado(): EstadoPedido { return this._estado; }
  get cantidadItems(): number { return this._detalles.reduce((n, d) => n + d.cantidad, 0); }
  get total(): number { return redondear(this._detalles.reduce((n, d) => n + d.subtotal, 0)); }

  agregar(detalle: DetallePedido): void {
    this.exigirBorrador();
    const existente = this._detalles.find(d => d.producto.id === detalle.producto.id && d.instrucciones === detalle.instrucciones);
    if (existente) existente.cambiarCantidad(existente.cantidad + detalle.cantidad);
    else this._detalles.push(detalle);
  }
  cambiarCantidad(indice: number, cantidad: number): void {
    this.exigirBorrador();
    const detalle = this.obtenerDetalle(indice);
    detalle.cambiarCantidad(cantidad);
  }
  eliminar(indice: number): DetallePedido {
    this.exigirBorrador();
    const [eliminado] = this._detalles.splice(this.validarIndice(indice), 1);
    return eliminado;
  }
  restaurar(detalle: DetallePedido): void { this.exigirBorrador(); this._detalles.push(detalle); }
  confirmar(): void {
    this.exigirBorrador();
    if (this._detalles.length === 0) throw new Error("Agrega al menos un producto antes de confirmar.");
    this._estado = "CONFIRMADO";
  }
  cancelar(): void {
    if (this._estado === "CANCELADO") throw new Error("El pedido ya está cancelado.");
    if (this._detalles.length === 0) throw new Error("No existe un pedido con productos para cancelar.");
    this._estado = "CANCELADO";
  }
  private exigirBorrador(): void {
    if (this._estado !== "BORRADOR") throw new Error("Solo se puede modificar un pedido en borrador.");
  }
  private validarIndice(i: number): number {
    if (!Number.isInteger(i) || i < 0 || i >= this._detalles.length) throw new Error("El producto seleccionado ya no existe.");
    return i;
  }
  private obtenerDetalle(i: number): DetallePedido { return this._detalles[this.validarIndice(i)]; }
}