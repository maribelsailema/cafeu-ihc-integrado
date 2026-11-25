import type { Pedido } from "../../domain/entities/Pedido";
export interface PedidoRepository {
  guardar(pedido: Pedido): Promise<void>;
  obtenerBorrador(): Promise<Pedido | null>;
  obtenerPorId(id: string): Promise<Pedido | null>;
  eliminarBorrador(): Promise<void>;
}