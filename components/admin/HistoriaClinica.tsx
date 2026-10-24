"use client";

import { useEffect, useState } from "react";

type Seccion = "Resumen" | "Antecedentes" | "Alergias" | "Diagnósticos" | "Tratamientos" | "Evolución";
type Registro = { id: string; seccion: Exclude<Seccion,"Resumen">; fecha: string; titulo: string; detalle: string };
const SECCIONES: Seccion[] = ["Resumen","Antecedentes","Alergias","Diagnósticos","Tratamientos","Evolución"];
const CLAVE = "vitalis-historia-clinica-08c-v1";
const INPUT = "w-full rounded-xl border border-line bg-white px-3 py-2.5 text-ink";
const BOTON = "min-h-11 rounded-xl bg-navy px-4 py-2 font-semibold text-white";
const FECHA = () => new Date().toISOString().slice(0,10);
const INICIALES: Record<string, Registro[]> = {
 "demo-001": [
  {id:"hc-l1",seccion:"Antecedentes",fecha:"2026-10-20",titulo:"Control preventivo",detalle:"Paciente en seguimiento periódico. Registro ilustrativo."},
  {id:"hc-l2",seccion:"Evolución",fecha:"2026-10-22",titulo:"Visita de seguimiento",detalle:"Se registra evolución estable durante la visita."}
 ],
 "demo-002": [
  {id:"hc-r1",seccion:"Diagnósticos",fecha:"2026-10-19",titulo:"Seguimiento domiciliario",detalle:"Evaluación inicial para plan de cuidados."},
  {id:"hc-r2",seccion:"Tratamientos",fecha:"2026-10-21",titulo:"Plan de cuidados",detalle:"Controles programados según indicación profesional."}
 ]
};
export default function HistoriaClinica({pacienteId}:{pacienteId:string}) {
 const [registros,setRegistros]=useState<Registro[]>([]);
 const [seccion,setSeccion]=useState<Seccion>("Resumen");
 const [abierto,setAbierto]=useState(false);
 const [titulo,setTitulo]=useState("");
 const [detalle,setDetalle]=useState("");
 const [fecha,setFecha]=useState(FECHA);
 const [error,setError]=useState("");
 const [cargado,setCargado]=useState(false);
 useEffect(()=>{
  try {
   const guardado=localStorage.getItem(CLAVE);
   const mapa:Record<string,Registro[]>=guardado?JSON.parse(guardado):{};
   setRegistros(Array.isArray(mapa[pacienteId])?mapa[pacienteId]:INICIALES[pacienteId]||[]);
  } catch {setRegistros(INICIALES[pacienteId]||[]);}
  setSeccion("Resumen");setAbierto(false);setCargado(true);
 },[pacienteId]);
 useEffect(()=>{
  if(!cargado)return;
  try{const mapa:Record<string,Registro[]>=JSON.parse(localStorage.getItem(CLAVE)||"{}");mapa[pacienteId]=registros;localStorage.setItem(CLAVE,JSON.stringify(mapa));}catch{/* La pantalla continúa disponible si el navegador bloquea el almacenamiento. */}
 },[registros,pacienteId,cargado]);
 function guardar(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();
  if(seccion==="Resumen"||!titulo.trim()||!detalle.trim()||!fecha){setError("Completá fecha, título y descripción.");return;}
  setRegistros(v=>[{id:"hc-"+Date.now().toString(36),seccion,fecha,titulo:titulo.trim(),detalle:detalle.trim()},...v]);
  setTitulo("");setDetalle("");setError("");setAbierto(false);
 }
 const visibles=registros.filter(r=>seccion==="Resumen"||r.seccion===seccion).sort((a,b)=>b.fecha.localeCompare(a.fecha));
 return <section className="mt-5 rounded-xl border border-line bg-white p-4 md:p-5" aria-label="Historia clínica">
  <div className="mb-4"><h3 className="font-display text-xl text-navy">Historia clínica</h3><p className="mt-1 text-sm text-ink-soft">Antecedentes, diagnósticos, tratamientos y evolución del paciente.</p></div>
  <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Secciones de historia clínica">
   {SECCIONES.map(s=><button type="button" key={s} aria-pressed={seccion===s} onClick={()=>{setSeccion(s);setAbierto(false);setError("");}} className={seccion===s?"min-h-11 rounded-xl bg-navy px-3 py-2 text-sm font-semibold text-white":"min-h-11 rounded-xl border border-line px-3 py-2 text-sm font-medium text-navy"}>{s}</button>)}
  </div>
  {seccion!=="Resumen"&&<div className="mb-4"><button type="button" className={BOTON} onClick={()=>setAbierto(v=>!v)}>{abierto?"Cancelar":" + Agregar registro"}</button></div>}
  {abierto&&seccion!=="Resumen"&&<form onSubmit={guardar} className="mb-5 space-y-3 rounded-xl bg-paper p-4">
   <h4 className="font-semibold text-navy">Nuevo registro de {seccion.toLowerCase()}</h4>
   <div className="grid gap-3 md:grid-cols-2"><label className="flex flex-col gap-1 text-sm">Fecha<input className={INPUT} type="date" value={fecha} onChange={e=>setFecha(e.target.value)}/></label><label className="flex flex-col gap-1 text-sm">Título<input className={INPUT} value={titulo} maxLength={120} onChange={e=>setTitulo(e.target.value)} placeholder="Descripción breve"/></label></div>
   <label className="flex flex-col gap-1 text-sm">Descripción<textarea className={INPUT} rows={4} value={detalle} maxLength={1500} onChange={e=>setDetalle(e.target.value)} placeholder="Detalles del registro"/></label>
   {error&&<p role="alert" className="text-red-700">{error}</p>}<button type="submit" className={BOTON}>Guardar registro</button>
  </form>}
  <p className="mb-3 text-sm text-ink-soft">{visibles.length} {visibles.length===1?"registro":"registros"} {seccion==="Resumen"?"en la historia clínica":"en "+seccion.toLowerCase()}</p>
  {visibles.length===0?<p className="rounded-xl bg-paper p-4 text-sm text-ink-soft">Todavía no hay registros en esta sección.</p>:<ul className="space-y-3">{visibles.map(r=><li key={r.id} className="rounded-xl border border-line p-4"><div className="flex flex-wrap items-center justify-between gap-2"><h4 className="font-semibold text-navy">{r.titulo}</h4><time className="text-sm text-ink-soft" dateTime={r.fecha}>{r.fecha}</time></div><p className="mt-1 text-xs font-semibold text-ink-soft">{r.seccion}</p><p className="mt-2 whitespace-pre-wrap text-sm text-ink">{r.detalle}</p></li>)}</ul>}
 </section>;
}
