"use client";
import { useEffect, useMemo, useState } from "react";
import { EncabezadoPagina, Panel } from "@/components/admin/Encabezado";

type Rol = "Administrador" | "Supervisor" | "Enfermero";
type Funcionario = { id: string; nombre: string; apellido: string; documento: string; telefono: string; correo: string; matricula: string; rol: Rol; activo: boolean };
const CLAVE = "vitalis-demo-funcionarios-08b";
const INICIALES: Funcionario[] = [
 { id:"func-demo-1", nombre:"Carlos", apellido:"Benítez", documento:"FUN-001", telefono:"000 000 001", correo:"", matricula:"", rol:"Administrador", activo:true },
 { id:"func-demo-2", nombre:"Laura", apellido:"Martínez", documento:"FUN-002", telefono:"000 000 002", correo:"", matricula:"", rol:"Supervisor", activo:true },
 { id:"func-demo-3", nombre:"Andrea", apellido:"Villalba", documento:"FUN-003", telefono:"000 000 003", correo:"", matricula:"MAT-003", rol:"Enfermero", activo:false }
];
const VACIO: Funcionario = { id:"",nombre:"",apellido:"",documento:"",telefono:"",correo:"",matricula:"",rol:"Enfermero",activo:true };
const CAMPO="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-ink";
const BOTON="min-h-11 rounded-xl bg-navy px-4 py-2 font-semibold text-white";
export default function FuncionariosPage() {
 const [datos,setDatos]=useState<Funcionario[]>([]);
 const [cargado,setCargado]=useState(false);
 const [busqueda,setBusqueda]=useState("");
 const [filtro,setFiltro]=useState("Todos");
 const [form,setForm]=useState<Funcionario|null>(null);
 const [error,setError]=useState("");
 useEffect(()=>{try{const raw=localStorage.getItem(CLAVE);const lista=raw?JSON.parse(raw):INICIALES;setDatos(Array.isArray(lista)?lista.map((f:Funcionario)=>f.id==="func-demo-1"&&f.nombre==="Funcionario"&&f.apellido==="Demostración A"?{...f,nombre:"Carlos",apellido:"Benítez",documento:"FUN-001"}:f.id==="func-demo-2"&&f.nombre==="Funcionario"&&f.apellido==="Demostración B"?{...f,nombre:"Laura",apellido:"Martínez",documento:"FUN-002"}:f.id==="func-demo-3"&&f.nombre==="Funcionario"&&f.apellido==="Demostración C"?{...f,nombre:"Andrea",apellido:"Villalba",documento:"FUN-003",matricula:"MAT-003"}:f):INICIALES);}catch{setDatos(INICIALES);}setCargado(true);},[]);
 useEffect(()=>{if(cargado)localStorage.setItem(CLAVE,JSON.stringify(datos));},[datos,cargado]);
 const filtrados=useMemo(()=>datos.filter(f=>(filtro==="Todos"||f.rol===filtro||filtro==="Activos"&&f.activo||filtro==="Inactivos"&&!f.activo)&&[f.nombre,f.apellido,f.documento,f.matricula].join(" ").toLowerCase().includes(busqueda.toLowerCase().trim())),[datos,busqueda,filtro]);
 function guardar(e:React.FormEvent<HTMLFormElement>){e.preventDefault();if(!form)return;const d=form.documento.trim();if(!form.nombre.trim()||!form.apellido.trim()||!d){setError("Nombre, apellido y documento son obligatorios.");return;}if(datos.some(f=>f.id!==form.id&&f.documento.toLowerCase()===d.toLowerCase())){setError("El documento ya está registrado.");return;}const f={...form,nombre:form.nombre.trim(),apellido:form.apellido.trim(),documento:d,id:form.id||"func-"+Date.now().toString(36)};setDatos(v=>form.id?v.map(x=>x.id===f.id?f:x):[f,...v]);setForm(null);setError("");}
 function campo(etiqueta:string,clave:keyof Funcionario,tipo="text"){return <label className="flex flex-col gap-1 text-sm font-medium">{etiqueta}<input className={CAMPO} type={tipo} value={String(form?.[clave]??"")} onChange={e=>setForm(f=>f?{...f,[clave]:e.target.value}:f)}/></label>;}
 return <div className="space-y-5">
  <EncabezadoPagina titulo="Funcionarios" descripcion="Administrá el personal, sus perfiles y estados." />
  
  {form ? <Panel titulo={form.id?"Editar funcionario":"Nuevo funcionario"}>
   <form onSubmit={guardar} className="space-y-4"><div className="grid gap-4 md:grid-cols-2">
   {campo("Nombre *","nombre")}{campo("Apellido *","apellido")}{campo("Número de cédula **","documento")}{campo("Teléfono","telefono")}{campo("Correo electrónico","correo","email")}{campo("Matrícula profesional","matricula")}
   <label className="flex flex-col gap-1 text-sm font-medium">Perfil<select className={CAMPO} value={form.rol} onChange={e=>setForm(f=>f?{...f,rol:e.target.value as Rol}:f)}>{(["Administrador","Supervisor","Enfermero"] as Rol[]).map(r=><option key={r}>{r}</option>)}</select></label>
   <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={form.activo} onChange={e=>setForm(f=>f?{...f,activo:e.target.checked}:f)}/> Funcionario activo</label></div>
   {error&&<p role="alert" className="text-red-700">{error}</p>}
   <div className="flex flex-wrap gap-3"><button className={BOTON} type="submit">Guardar funcionario</button><button className="min-h-11 rounded-xl border border-line px-4" type="button" onClick={()=>{setForm(null);setError("");}}>Cancelar</button></div></form>
  </Panel> : <>
   <div className="flex flex-wrap items-end justify-between gap-3"><div className="flex flex-wrap gap-3"><label className="flex flex-col gap-1 text-sm">Buscar<input className={CAMPO} type="search" placeholder="Nombre, documento o matrícula" value={busqueda} onChange={e=>setBusqueda(e.target.value)}/></label><label className="flex flex-col gap-1 text-sm">Filtrar<select className={CAMPO} value={filtro} onChange={e=>setFiltro(e.target.value)}>{["Todos","Administrador","Supervisor","Enfermero","Activos","Inactivos"].map(x=><option key={x}>{x}</option>)}</select></label></div><button className={BOTON} type="button" onClick={()=>{setForm({...VACIO});setError("");}}>+ Nuevo funcionario</button></div>
   <p role="status" className="text-sm text-ink-soft">{filtrados.length} de {datos.length} funcionarios</p>
   <ul className="grid gap-3">{filtrados.map(f=><li key={f.id} className="rounded-2xl border border-line bg-white p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold text-navy">{f.nombre} {f.apellido}</h2><p className="text-sm text-ink-soft">{f.documento} · {f.rol} · {f.activo?"Activo":"Inactivo"}</p>{f.matricula&&<p className="text-xs text-ink-soft">Matrícula: {f.matricula}</p>}</div><div className="flex flex-wrap gap-2"><button type="button" className="min-h-11 rounded-xl border border-line px-3 font-semibold text-navy" onClick={()=>setForm({...f})}>Editar</button><button type="button" className="min-h-11 rounded-xl border border-line px-3 font-semibold text-navy" onClick={()=>setDatos(v=>v.map(x=>x.id===f.id?{...x,activo:!x.activo}:x))}>{f.activo?"Desactivar":"Activar"}</button></div></div></li>)}</ul>
   {cargado&&filtrados.length===0&&<p className="rounded-xl bg-paper p-5">No se encontraron funcionarios.</p>}
  </>}
 </div>;
}
