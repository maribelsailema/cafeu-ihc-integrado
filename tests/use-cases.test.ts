import { describe,it,expect } from "vitest";
import { PedidoUseCases } from "../src/application/use-cases/PedidoUseCases";
import { Producto } from "../src/domain/entities/Producto";
import type { Pedido } from "../src/domain/entities/Pedido";
import type { PedidoRepository } from "../src/application/ports/PedidoRepository";
import type { ProductoRepository } from "../src/application/ports/ProductoRepository";

class RepoPedido implements PedidoRepository {
  pedido:Pedido|null=null;
  async guardar(p:Pedido){this.pedido=p;}
  async obtenerBorrador(){return this.pedido?.estado==="BORRADOR"?this.pedido:null;}
  async obtenerPorId(id:string){return this.pedido?.id===id?this.pedido:null;}
  async eliminarBorrador(){this.pedido=null;}
}
class RepoProducto implements ProductoRepository {
  async listar(){return [new Producto({id:"cafe",nombre:"Café americano",descripcion:"",precio:1.5,categoria:"Bebidas calientes",imagen:"☕"})];}
}
describe("Casos de uso",()=>{
 it("agrega, modifica, elimina y restaura un producto",async()=>{
  const rp=new RepoPedido(), uc=new PedidoUseCases(rp,new RepoProducto(),()=>"CU-TEST");
  await uc.agregarAlCarrito("cafe",2);expect(rp.pedido?.total).toBe(3);
  await uc.modificarCantidad(0,3);expect(rp.pedido?.total).toBe(4.5);
  const eliminado=await uc.eliminarProducto(0);expect(eliminado.pedido.cantidadItems).toBe(0);
  await uc.deshacerEliminacion(eliminado.eliminado);expect(rp.pedido?.cantidadItems).toBe(3);
 });
 it("confirma el pedido y bloquea la edición posterior",async()=>{
  const rp=new RepoPedido(), uc=new PedidoUseCases(rp,new RepoProducto(),()=>"CU-TEST");
  await uc.agregarAlCarrito("cafe");const p=await uc.confirmarPedido();expect(p.estado).toBe("CONFIRMADO");
  await expect(uc.modificarCantidad(0,2)).rejects.toThrow();
  const cancelado=await uc.cancelarPedido("CU-TEST");expect(cancelado.estado).toBe("CANCELADO");
 });
 it("rechaza producto inexistente",async()=>{
  const uc=new PedidoUseCases(new RepoPedido(),new RepoProducto());
  await expect(uc.agregarAlCarrito("no-existe")).rejects.toThrow();
 });
});