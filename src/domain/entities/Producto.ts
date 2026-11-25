export type Categoria = "Bebidas calientes" | "Sánduches" | "Snacks";

export interface ProductoProps {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: Categoria;
  imagen: string;
  permiteInstrucciones?: boolean;
}

export class Producto {
  readonly id: string;
  readonly nombre: string;
  readonly descripcion: string;
  readonly precio: number;
  readonly categoria: Categoria;
  readonly imagen: string;
  readonly permiteInstrucciones: boolean;

  constructor(props: ProductoProps) {
    if (!props.id.trim() || !props.nombre.trim()) throw new Error("El producto requiere identificador y nombre.");
    if (!Number.isFinite(props.precio) || props.precio < 0) throw new Error("El precio del producto no es válido.");
    this.id = props.id;
    this.nombre = props.nombre.trim();
    this.descripcion = props.descripcion.trim();
    this.precio = redondear(props.precio);
    this.categoria = props.categoria;
    this.imagen = props.imagen;
    this.permiteInstrucciones = props.permiteInstrucciones ?? true;
  }
}
export const redondear = (valor: number): number => Math.round((valor + Number.EPSILON) * 100) / 100;