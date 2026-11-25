import { Producto, type ProductoProps } from "../../domain/entities/Producto";
import type { ProductoRepository } from "../../application/ports/ProductoRepository";

const catalogo: ProductoProps[] = [
  { id:"americano", nombre:"Café americano", descripcion:"Espresso recién preparado con agua caliente. Un café suave, aromático y perfecto para comenzar el día.", precio:1.50, categoria:"Bebidas calientes", imagen:"☕", permiteInstrucciones:true },
  { id:"sanduche", nombre:"Sánduche", descripcion:"Pan fresco con relleno preparado al momento.", precio:2.75, categoria:"Sánduches", imagen:"🥪", permiteInstrucciones:true },
  { id:"capuchino", nombre:"Capuchino", descripcion:"Café espresso con leche cremosa y espuma.", precio:2.00, categoria:"Bebidas calientes", imagen:"🍵", permiteInstrucciones:true },
  { id:"galleta", nombre:"Galleta de avena", descripcion:"Galleta horneada de avena.", precio:1.25, categoria:"Snacks", imagen:"🍪", permiteInstrucciones:false }
];
export class CatalogoLocal implements ProductoRepository {
  async listar(): Promise<Producto[]> { return catalogo.map(p => new Producto(p)); }
}