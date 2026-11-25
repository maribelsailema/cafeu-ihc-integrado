import { Producto, redondear } from "./Producto";

export interface DetallePedidoProps {
  producto: Producto;
  cantidad: number;
  instrucciones?: string;
}
export class DetallePedido {
  readonly producto: Producto;
  cantidad: number;
  instrucciones: string;

  constructor(props: DetallePedidoProps) {
    this.producto = props.producto;
    this.cantidad = validarCantidad(props.cantidad);
    this.instrucciones = (props.instrucciones ?? "").trim();
    if (!this.producto.permiteInstrucciones && this.instrucciones) {
      throw new Error("Este producto no admite instrucciones especiales.");
    }
  }
  get subtotal(): number { return redondear(this.producto.precio * this.cantidad); }
  cambiarCantidad(cantidad: number): void { this.cantidad = validarCantidad(cantidad); }
  cambiarInstrucciones(instrucciones: string): void {
    const nota = instrucciones.trim();
    if (!this.producto.permiteInstrucciones && nota) throw new Error("Este producto no admite instrucciones especiales.");
    this.instrucciones = nota;
  }
}
export function validarCantidad(cantidad: number): number {
  if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 99) {
    throw new Error("La cantidad debe ser un número entero entre 1 y 99.");
  }
  return cantidad;
}