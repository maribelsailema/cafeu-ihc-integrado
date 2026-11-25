import { describe, it, expect } from "vitest";
import { Producto } from "../src/domain/entities/Producto";
import { DetallePedido } from "../src/domain/entities/DetallePedido";
import { Pedido } from "../src/domain/entities/Pedido";
import { buscarProductos } from "../src/domain/services/busqueda";

const cafe = () => new Producto({id:"americano",nombre:"Café americano",descripcion:"Café suave",precio:1.5,categoria:"Bebidas calientes",imagen:"☕"});
describe("Dominio CaféU",()=>{
 it("calcula subtotales y total correctamente",()=>{const p=new Pedido("CU-1");p.agregar(new DetallePedido({producto:cafe(),cantidad:2}));expect(p.total).toBe(3);});
 it("rechaza cantidades fraccionarias, cero y mayores a 99",()=>{expect(()=>new DetallePedido({producto:cafe(),cantidad:0})).toThrow();expect(()=>new DetallePedido({producto:cafe(),cantidad:1.5})).toThrow();expect(()=>new DetallePedido({producto:cafe(),cantidad:100})).toThrow();});
 it("agrupa producto e instrucciones iguales",()=>{const p=new Pedido("CU-1");p.agregar(new DetallePedido({producto:cafe(),cantidad:1}));p.agregar(new DetallePedido({producto:cafe(),cantidad:2}));expect(p.detalles).toHaveLength(1);expect(p.detalles[0].cantidad).toBe(3);});
 it("no permite confirmar pedido vacío",()=>{expect(()=>new Pedido("CU-1").confirmar()).toThrow();});
 it("bloquea cambios después de confirmar",()=>{const p=new Pedido("CU-1");p.agregar(new DetallePedido({producto:cafe(),cantidad:1}));p.confirmar();expect(()=>p.eliminar(0)).toThrow();});
 it("busca sin distinguir tildes ni mayúsculas",()=>{expect(buscarProductos([cafe()],"CAFE")).toHaveLength(1);expect(buscarProductos([cafe()],"bebidas CALIENTES")).toHaveLength(1);});
});