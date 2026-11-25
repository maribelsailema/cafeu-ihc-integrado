import { Producto } from "../entities/Producto";

export function normalizarTexto(texto: string): string {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es").trim();
}
export function buscarProductos(productos: Producto[], consulta: string): Producto[] {
  const q = normalizarTexto(consulta);
  if (!q) return productos;
  return productos.filter(p => normalizarTexto(`${p.nombre} ${p.descripcion} ${p.categoria}`).includes(q));
}