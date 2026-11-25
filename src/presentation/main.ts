import { CatalogoLocal } from "../infrastructure/catalogo/CatalogoLocal";
import { LocalStoragePedidoRepository } from "../infrastructure/persistence/LocalStoragePedidoRepository";
import { PedidoUseCases } from "../application/use-cases/PedidoUseCases";
import type { Producto, Categoria } from "../domain/entities/Producto";
import type { DetallePedido } from "../domain/entities/DetallePedido";
import "./styles.css";

const casos = new PedidoUseCases(new LocalStoragePedidoRepository(), new CatalogoLocal());
type Pantalla = "inicio" | "menu" | "detalle" | "pedido" | "estado" | "confirmacion";
let pantalla: Pantalla = "inicio";
let productos: Producto[] = [];
let categoria: Categoria | "Todos" = "Todos";
let consulta = "";
let seleccionado: Producto | null = null;
let instrucciones = "";
let cantidadDetalle = 1;
let pedidoIdConfirmado = "";
let totalConfirmado = 0;
let itemsConfirmados = 0;
let ultimoEliminado: DetallePedido | null = null;
let toastTimer: number | undefined;
let modalCancelacion = false;
let pedidoCancelado = false;

const app = document.querySelector<HTMLDivElement>("#app")!;
const dinero = (n:number) => `$${n.toFixed(2)}`;
const escapar = (s:string) => s.replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]!));
const mostrarError = (e:unknown) => toast(e instanceof Error ? e.message : "Ocurrió un error inesperado.", true);
function toast(mensaje:string, error=false, undo=false) {
  const old=document.querySelector(".toast"); old?.remove();
  const el=document.createElement("div"); el.className=`toast ${error?"error":""}`;
  el.innerHTML=`<span>${escapar(mensaje)}</span>${undo?'<button class="undo" type="button">Deshacer</button>':""}`;
  document.body.append(el);
  if(undo) el.querySelector("button")?.addEventListener("click", async()=> {
    if(!ultimoEliminado) return;
    try { await casos.deshacerEliminacion(ultimoEliminado); ultimoEliminado=null; el.remove(); await render(); toast("Producto restaurado."); }
    catch(e){ mostrarError(e); }
  });
  if(toastTimer) window.clearTimeout(toastTimer);
  toastTimer=window.setTimeout(()=>el.remove(), undo?5000:3000);
}
function cabecera():string {
 return `<header class="top"><button class="brand" data-go="inicio">CaféU</button><span class="tagline">CAFETERÍA UNIVERSITARIA</span><button class="cart-top" data-go="pedido" aria-label="Abrir mi pedido">🛒 <b id="header-count">0</b></button></header>`;
}
function nav():string {
 return `<nav class="bottom-nav"><button data-go="inicio" class="${pantalla==="inicio"?"active":""}">⌂<small>Inicio</small></button><button data-go="menu" class="${pantalla==="menu"?"active":""}">▦<small>Menú</small></button><button data-go="pedido" class="${pantalla==="pedido"?"active":""}">🛍<small>Mi pedido</small></button></nav>`;
}
async function resumenPedido() { return await casos.obtenerPedido(); }
async function render() {
 productos=await casos.listarProductos();
 const pedido=await resumenPedido();
 const count=pedido?.cantidadItems??0, total=pedido?.total??0;
 let contenido="";
 if(pantalla==="inicio") contenido=`<section class="hero"><p class="eyebrow">TU PAUSA, SIN ESPERAS</p><h1>Hola, Julia</h1><p class="muted">Buenos días, ¿qué se te antoja hoy?</p><form class="search-wrap" id="search-home-form"><input id="search-home" placeholder="¿Qué se te antoja hoy?" aria-label="Buscar en el menú"><button class="search-submit" type="submit" aria-label="Buscar">⌕</button></form><article class="banner"><div><small>CAFETERÍA UNIVERSITARIA</small><h2>¡Evita la fila!</h2><p>Pide desde aquí. Retira entre clases.</p><button class="primary" data-go="menu">Ver Menú</button></div><div class="banner-icon">☕</div></article><h3>Tu café, en tres pasos</h3><div class="steps"><span>1. Elige<br><small>Del menú</small></span><span>2. Confirma<br><small>Tu pedido</small></span><span>3. Retira<br><small>Paga en caja</small></span></div><div class="pickup">⌖ &nbsp; Nos vemos en la cafetería<br><small>Campus central · Lun–Vie, 7:00–18:00</small></div></section>`;
 if(pantalla==="menu") {
   const cats=["Todos","Bebidas calientes","Sánduches","Snacks"] as const;
   const filtrados=productos.filter(p=>(categoria==="Todos"||p.categoria===categoria)&&(!consulta||`${p.nombre} ${p.descripcion} ${p.categoria}`.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().includes(consulta.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase())));
   contenido=`<section><div class="page-title"><div><p class="eyebrow">HECHO PARA TU PAUSA</p><h1>Menú</h1></div><span class="muted">CAFÉU</span></div><input id="search-menu" class="search" value="${escapar(consulta)}" placeholder="Buscar productos..." aria-label="Buscar productos"><div class="chips">${cats.map(c=>`<button data-category="${c}" class="${categoria===c?"selected":""}">${c}</button>`).join("")}</div><div class="product-grid">${filtrados.map(p=>`<article class="product"><div class="product-art">${p.imagen}</div><div class="product-info"><b>${p.nombre}</b><p>${dinero(p.precio)}</p>${p.permiteInstrucciones?'<span class="personalizable">Personalizable</span>':""}<div class="actions"><button class="outline" data-detail="${p.id}">Ver opciones</button><button class="primary small" data-add="${p.id}">Añadir</button></div></div></article>`).join("")||'<p class="empty">No encontramos productos. Prueba otra búsqueda.</p>'}</div></section>`;
 }
 if(pantalla==="detalle"&&seleccionado) contenido=`<section><button class="back" data-go="menu">‹ Volver al menú</button><div class="detail-art">${seleccionado.imagen}</div><p class="eyebrow">${seleccionado.categoria}</p><h1>${seleccionado.nombre}</h1><h3>${dinero(seleccionado.precio)}</h3><p class="muted">${seleccionado.descripcion}</p>${seleccionado.permiteInstrucciones?`<label for="instructions">Instrucciones especiales <small>(opcional)</small></label><textarea id="instructions" maxlength="160" placeholder="Ej. Sin azúcar, leche deslactosada...">${escapar(instrucciones)}</textarea>`:""}<label>Cantidad</label><div class="stepper"><button data-detail-qty="-1">−</button><b>${cantidadDetalle}</b><button data-detail-qty="1">+</button></div><button class="primary wide" id="add-detail">Añadir al pedido · ${dinero(seleccionado.precio*cantidadDetalle)}</button></section>`;
 if(pantalla==="pedido") contenido=`<section><p class="eyebrow">TU PAUSA ESTÁ CERCA</p><h1>Mi Pedido</h1>${pedido?.detalles.length?`<p class="muted">${pedido.cantidadItems} ${pedido.cantidadItems===1?"ítem":"ítems"}</p><div class="order-list">${pedido.detalles.map((d,i)=>`<article class="order-item"><span class="order-art">${d.producto.imagen}</span><div class="order-main"><b>${d.producto.nombre}</b><small>${dinero(d.producto.precio)} c/u</small>${d.instrucciones?`<small class="note">Nota: ${escapar(d.instrucciones)}</small>`:""}<div class="row-controls"><div class="stepper compact"><button data-qty="${i}" data-delta="-1" aria-label="Disminuir cantidad">−</button><b>${d.cantidad}</b><button data-qty="${i}" data-delta="1" aria-label="Aumentar cantidad">+</button></div><button class="delete" data-delete="${i}">Eliminar</button></div></div><b>${dinero(d.subtotal)}</b></article>`).join("")}</div><div class="summary"><h3>Resumen</h3><div><span>Subtotal</span><b>${dinero(pedido.total)}</b></div><div class="grand"><span>Total</span><strong>${dinero(pedido.total)}</strong></div></div><div class="payment">▣ &nbsp; <b>Pago en caja</b><small> Paga al retirar tu pedido. Sin cobro en la app.</small></div><button class="primary wide" id="confirm">Confirmar pedido · ${dinero(pedido.total)}</button><button class="text-button wide" data-go="menu">Seguir comprando</button>`:`<div class="empty-state"><div>🛍️</div><h2>Tu pedido está vacío</h2><p class="muted">Aún no agregas productos. Explora el menú y encuentra algo para tu pausa.</p><button class="primary" data-go="menu">Explorar menú</button></div>`}</section>`;
 if(pantalla==="estado") contenido=`<section><p class="eyebrow">CAFÉU · PEDIDO</p><h1>${pedidoCancelado?"Pedido cancelado":"Pedido recibido"}</h1><div class="status-card"><div class="status-icon">${pedidoCancelado?"×":"✓"}</div><h2>${pedidoCancelado?"Tu pedido fue cancelado":"¡Recibimos tu pedido!"}</h2><p>${pedidoCancelado?"No se continuará preparando este pedido.":"Estamos preparando todo para tu pausa."}</p><div class="order-code">${pedidoIdConfirmado}</div>${pedidoCancelado?"":`<span class="status-pill">En preparación</span><p class="muted">Tiempo estimado: 5–10 minutos</p><p class="muted">Total a pagar: <b>${dinero(totalConfirmado)}</b></p>`}</div>${pedidoCancelado?`<button class="primary wide" data-go="menu">Volver al menú</button>`:`<button class="primary wide" data-go="confirmacion">Ver comprobante</button><button class="text-button wide" id="open-cancel">Cancelar pedido</button>`}</section>${modalCancelacion?`<div class="modal-backdrop"><div class="modal"><h2>¿Deseas cancelar tu pedido?</h2><p class="muted">Si cancelas, el pedido ${pedidoIdConfirmado} dejará de estar activo.</p><div class="modal-actions"><button class="outline" id="close-cancel">Volver al pedido</button><button class="danger" id="confirm-cancel">Sí, cancelar</button></div></div></div>`:""}`;
 if(pantalla==="confirmacion") contenido=`<section class="receipt"><div class="status-icon">✓</div><h1>¡Pedido recibido!</h1><p class="muted">Tu próxima pausa ya está en marcha.<br>Nos vemos en la cafetería.</p><p class="eyebrow">TU NÚMERO DE PEDIDO</p><div class="order-code">${pedidoIdConfirmado}</div><div class="receipt-lines"><span>${itemsConfirmados} ítems</span><b>Total a pagar ${dinero(totalConfirmado)}</b></div><div class="payment"><b>Retira y paga en caja</b><small>Acércate a la cafetería y muestra el número de pedido para retirar tu compra.</small></div><p class="muted">Listo en aproximadamente 5–10 minutos.</p><button class="primary wide" data-go="inicio">Volver al inicio</button></section>`;
 app.innerHTML=`<div class="shell">${cabecera()}<main>${contenido}</main>${nav()}${pantalla==="menu"&&count?`<button class="floating-cart" data-go="pedido"><span>${count} ${count===1?"ítem":"ítems"} · ${dinero(total)}</span><b>Ver mi pedido →</b></button>`:""}</div>`;
 const headerCount=document.querySelector("#header-count"); if(headerCount) headerCount.textContent=String(count);
 bind();
}
function bind() {
 document.querySelectorAll<HTMLElement>("[data-go]").forEach(b=>b.addEventListener("click",()=>{pantalla=b.dataset.go as Pantalla;void render();}));
 document.querySelectorAll<HTMLElement>("[data-category]").forEach(b=>b.addEventListener("click",()=>{categoria=b.dataset.category as Categoria|"Todos";void render();}));
 document.querySelectorAll<HTMLElement>("[data-add]").forEach(b=>b.addEventListener("click",async()=>{try{await casos.agregarAlCarrito(b.dataset.add!);toast("Producto añadido al pedido.");await render();}catch(e){mostrarError(e);}}));
 document.querySelectorAll<HTMLElement>("[data-detail]").forEach(b=>b.addEventListener("click",()=>{seleccionado=productos.find(p=>p.id===b.dataset.detail)??null;instrucciones="";cantidadDetalle=1;pantalla="detalle";void render();}));
 const homeSearch=document.querySelector<HTMLInputElement>("#search-home");
 document.querySelector("#search-home-form")?.addEventListener("submit",e=>{e.preventDefault();consulta=homeSearch?.value.trim()??"";pantalla="menu";void render();});
 const menuSearch=document.querySelector<HTMLInputElement>("#search-menu");
 menuSearch?.addEventListener("input",()=>{consulta=menuSearch.value; const pos=menuSearch.selectionStart;void render().then(()=>{const el=document.querySelector<HTMLInputElement>("#search-menu");el?.focus();el?.setSelectionRange(pos,pos);});});
 document.querySelectorAll<HTMLElement>("[data-detail-qty]").forEach(b=>b.addEventListener("click",()=>{cantidadDetalle=Math.max(1,Math.min(99,cantidadDetalle+Number(b.dataset.detailQty)));void render();}));
 document.querySelector("#add-detail")?.addEventListener("click",async()=>{if(!seleccionado)return;try{const note=document.querySelector<HTMLTextAreaElement>("#instructions")?.value??"";await casos.agregarAlCarrito(seleccionado.id,cantidadDetalle,note);pantalla="pedido";toast("Producto añadido al pedido.");await render();}catch(e){mostrarError(e);}});
 document.querySelectorAll<HTMLElement>("[data-qty]").forEach(b=>b.addEventListener("click",async()=>{try{const i=Number(b.dataset.qty),d=Number(b.dataset.delta);const p=await casos.obtenerPedido();if(!p)return;const q=p.detalles[i].cantidad+d;if(q<1){await eliminar(i);return;}await casos.modificarCantidad(i,q);await render();}catch(e){mostrarError(e);}}));
 document.querySelectorAll<HTMLElement>("[data-delete]").forEach(b=>b.addEventListener("click",()=>void eliminar(Number(b.dataset.delete))));
 document.querySelector("#confirm")?.addEventListener("click",async()=>{try{const p=await casos.confirmarPedido();pedidoIdConfirmado=p.id;totalConfirmado=p.total;itemsConfirmados=p.cantidadItems;pedidoCancelado=false; pantalla="estado";await render();}catch(e){mostrarError(e);}});
 document.querySelector("#open-cancel")?.addEventListener("click",()=>{modalCancelacion=true;void render();});
 document.querySelector("#close-cancel")?.addEventListener("click",()=>{modalCancelacion=false;void render();});
 document.querySelector("#confirm-cancel")?.addEventListener("click",async()=>{try{await casos.cancelarPedido(pedidoIdConfirmado);modalCancelacion=false;pedidoCancelado=true;await render();toast("Pedido cancelado.");}catch(e){mostrarError(e);}});
}
async function eliminar(i:number) {
 try {const r=await casos.eliminarProducto(i);ultimoEliminado=r.eliminado;await render();toast("Producto eliminado.",false,true);}
 catch(e){mostrarError(e);}
}
void render().catch(mostrarError);