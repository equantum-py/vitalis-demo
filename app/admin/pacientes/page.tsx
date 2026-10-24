"use client";

import { useEffect, useMemo, useState } from "react";
import { EncabezadoPagina, Panel } from "@/components/admin/Encabezado";
import FichaClinica from "@/components/admin/FichaClinica";
import { PACIENTES_INICIALES_50 } from "@/lib/vitalis/pacientes-iniciales";

type Paciente = {
  id: string; nombre: string; apellido: string; documento: string; nacimiento: string;
  telefono: string; direccion: string; emergencia: string; afiliado: boolean;
  estado: "Activo" | "Internación domiciliaria" | "Alta" | "Suspendido" | "Inactivo";
  motivo: string;
};
const CLAVE = "vitalis-demo-pacientes-08a";
const EJEMPLOS: Paciente[] = [
  { id:"demo-001", nombre:"Lucía", apellido:"Benítez", documento:"PAC-001", nacimiento:"1982-05-12", telefono:"000 000 000", direccion:"Dirección 101", emergencia:"Familiar responsable", afiliado:true, estado:"Activo", motivo:"Seguimiento domiciliario" },
  { id:"demo-002", nombre:"Roberto", apellido:"Giménez", documento:"PAC-002", nacimiento:"1974-09-23", telefono:"000 000 001", direccion:"Dirección 202", emergencia:"Familiar responsable", afiliado:false, estado:"Internación domiciliaria", motivo:"Atención domiciliaria" }
];
const VACIO: Paciente = { id:"", nombre:"", apellido:"", documento:"", nacimiento:"", telefono:"", direccion:"", emergencia:"", afiliado:false, estado:"Activo", motivo:"" };
const ESTADOS: Paciente["estado"][] = ["Activo","Internación domiciliaria","Alta","Suspendido","Inactivo"];
const input = "w-full rounded-xl border border-line bg-white px-3 py-2.5 text-ink";
const boton = "inline-flex min-h-11 items-center justify-center rounded-xl bg-navy px-4 py-2 font-semibold text-white";
function edad(fecha:string) { if(!fecha) return "Sin dato"; const n=new Date(fecha+"T12:00:00"); if(Number.isNaN(n.getTime())) return "Sin dato"; const hoy=new Date(); let e=hoy.getFullYear()-n.getFullYear(); if(hoy.getMonth()<n.getMonth() || (hoy.getMonth()===n.getMonth() && hoy.getDate()<n.getDate())) e--; return e>=0?e+" años":"Sin dato"; }
export default function PacientesAdmin() {
 const [pacientes,setPacientes]=useState<Paciente[]>([]);
 const [listo,setListo]=useState(false);
 const [buscar,setBuscar]=useState("");
 const [estadoFiltro,setEstadoFiltro]=useState("Todos");
 const [seleccion,setSeleccion]=useState<string|null>(null);
 const [editando,setEditando]=useState(false);
 const [form,setForm]=useState<Paciente>(VACIO);
 const [error,setError]=useState("");
 useEffect(()=>{
  try {
   const raw=localStorage.getItem(CLAVE);
   const data=raw?JSON.parse(raw):EJEMPLOS;
   const existentes:Paciente[]=Array.isArray(data)?data:EJEMPLOS;
   const migrados=existentes.map(p=>p.id==="demo-001"&&p.nombre==="Paciente"&&p.apellido==="Demostración A"?{...p,nombre:"Lucía",apellido:"Benítez",documento:"PAC-001",direccion:"Barrio San Pablo, Asunción",emergencia:"Familiar responsable",motivo:"Seguimiento domiciliario"}:p.id==="demo-002"&&p.nombre==="Paciente"&&p.apellido==="Demostración B"?{...p,nombre:"Roberto",apellido:"Giménez",documento:"PAC-002",direccion:"Barrio Centro, Luque",emergencia:"Familiar responsable",motivo:"Atención domiciliaria"}:p);
   const ids=new Set(migrados.map(p=>p.id));
   const docs=new Set(migrados.map(p=>p.documento.trim().toLowerCase()));
   const adicionales=PACIENTES_INICIALES_50.filter(p=>!ids.has(p.id)&&!docs.has(p.documento.toLowerCase())) as Paciente[];
   setPacientes([...migrados,...adicionales]);
  } catch {setPacientes([...EJEMPLOS,...PACIENTES_INICIALES_50] as Paciente[]);}
  setListo(true);
 },[]);
 useEffect(()=>{if(listo) localStorage.setItem(CLAVE,JSON.stringify(pacientes));},[pacientes,listo]);
 const filtrados=useMemo(()=>pacientes.filter(p=> (estadoFiltro==="Todos"||p.estado===estadoFiltro) && [p.nombre,p.apellido,p.documento,p.telefono].join(" ").toLowerCase().includes(buscar.trim().toLowerCase())),[pacientes,buscar,estadoFiltro]);
 const actual=pacientes.find(p=>p.id===seleccion);
 function guardar(e:React.FormEvent<HTMLFormElement>){e.preventDefault();const d=form.documento.trim(); if(!form.nombre.trim()||!form.apellido.trim()||!d){setError("Nombre, apellido y documento son obligatorios.");return;}if(pacientes.some(p=>p.documento.trim().toLowerCase()===d.toLowerCase()&&p.id!==form.id)){setError("Ya existe un paciente con ese documento.");return;}const nuevo={...form,id:form.id||"demo-"+Date.now().toString(36),nombre:form.nombre.trim(),apellido:form.apellido.trim(),documento:d};setPacientes(prev=>form.id?prev.map(p=>p.id===form.id?nuevo:p):[nuevo,...prev]);setSeleccion(nuevo.id);setEditando(false);setError("");}
 function campo(etiqueta:string,llave:keyof Paciente,tipo="text"){return <label className="flex flex-col gap-1 text-sm font-medium text-ink">{etiqueta}<input className={input} type={tipo} value={String(form[llave]??"")} onChange={e=>setForm(v=>({...v,[llave]:e.target.value}))}/></label>;}
 return <div className="space-y-5">
  <EncabezadoPagina titulo="Pacientes" descripcion="Administrá pacientes, consultá sus fichas y actualizá su información." />
  
  {editando ? <Panel titulo={form.id?"Editar paciente":"Nuevo paciente"}>
   <form onSubmit={guardar} className="space-y-4">
    <div className="grid gap-4 md:grid-cols-2">{campo("Nombre *","nombre")}{campo("Apellido *","apellido")}{campo("Número de cédula *","documento")}{campo("Fecha de nacimiento","nacimiento","date")}{campo("Teléfono","telefono")}{campo("Dirección","direccion")}{campo("Contacto de emergencia","emergencia")}{campo("Motivo de atención","motivo")}
    <label className="flex flex-col gap-1 text-sm font-medium">Estado<select className={input} value={form.estado} onChange={e=>setForm(v=>({...v,estado:e.target.value as Paciente["estado"]}))}>{ESTADOS.map(s=><option key={s}>{s}</option>)}</select></label>
    <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={form.afiliado} onChange={e=>setForm(v=>({...v,afiliado:e.target.checked}))}/> Afiliado a Vitalis</label></div>
    {error&&<p role="alert" className="text-red-700">{error}</p>}
    <div className="flex flex-wrap gap-3"><button className={boton} type="submit">Guardar paciente</button><button type="button" className="rounded-xl border border-line px-4 py-2" onClick={()=>{setEditando(false);setError("");}}>Cancelar</button></div>
   </form>
  </Panel> : actual ? <Panel titulo="Ficha del paciente">
    <div className="mb-4 flex flex-wrap gap-3"><button type="button" className="rounded-xl border border-line px-4 py-2" onClick={()=>setSeleccion(null)}>← Volver al listado</button><button type="button" className={boton} onClick={()=>{setForm({...actual});setEditando(true);}}>Editar ficha</button></div>
    <FichaClinica paciente={actual} />
   </Panel> : <>
   <div className="flex flex-wrap items-end justify-between gap-3"><div className="flex flex-wrap gap-3"><label className="flex flex-col gap-1 text-sm">Buscar<input className={input} type="search" value={buscar} onChange={e=>setBuscar(e.target.value)} placeholder="Nombre, documento o teléfono"/></label><label className="flex flex-col gap-1 text-sm">Estado<select className={input} value={estadoFiltro} onChange={e=>setEstadoFiltro(e.target.value)}><option>Todos</option>{ESTADOS.map(s=><option key={s}>{s}</option>)}</select></label></div><button type="button" className={boton} onClick={()=>{setForm({...VACIO});setError("");setEditando(true);}}>+ Nuevo paciente</button></div>
   <p role="status" className="text-sm text-ink-soft">{filtrados.length} de {pacientes.length} pacientes</p>
   <ul className="grid gap-3">{filtrados.map(p=><li key={p.id} className="rounded-2xl border border-line bg-white p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-semibold text-ink">{p.nombre} {p.apellido}</p><p className="text-sm text-ink-soft">{p.documento} · {p.estado}</p></div><button type="button" className="min-h-11 rounded-xl border border-line px-4 font-semibold text-navy" onClick={()=>setSeleccion(p.id)}>Ver ficha</button></div></li>)}</ul>
   {listo&&filtrados.length===0&&<p className="rounded-xl bg-paper p-5 text-ink-soft">No se encontraron pacientes.</p>}
  </>}
 </div>;
}
