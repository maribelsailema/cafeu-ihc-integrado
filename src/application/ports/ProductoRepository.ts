import type { Producto } from "../../domain/entities/Producto";
export interface ProductoRepository { listar(): Promise<Producto[]>; }