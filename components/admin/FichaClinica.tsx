"use client";
import { useEffect, useState } from "react";
import { datosClinicosIniciales } from "@/lib/vitalis/pacientes-iniciales";
import HistoriaClinica from "@/components/admin/HistoriaClinica";

type PacienteInfo={id:string;nombre:string;apellido:string;documento:string;nacimiento:string;telefono:string;direccion:string;emergencia:string;afiliado:boolean;motivo:string;estado:string};
type Vital={fecha:string;ta:string;fc:string;fr:string;sat:string;glucemia:string;temp:string;peso:string;talla:string};
type Asiento={id:string;fecha:string;titulo:string;detalle:string};
type Indicacion={id:string;farmaco:string;dosis:string;via:string;frecuencia:string;prescriptor:string;desde:string;hasta:string};
type Archivo={id:string;nombre:string;tipo:"Foto"|"Documento";fecha:string};
type Datos={vitales:Vital[];enfermeria:Asiento[];indicaciones:Indicacion[];archivos:Archivo[]};
type Tab="Historia clínica"|"Enfermería"|"Indicaciones"|"Fotografías"|"Documentos"|"Ubicación";
const tabs:Tab[]=["Historia clínica","Enfermería","Indicaciones","Fotografías","Documentos","Ubicación"];
const inicial:Datos={vitales:[],enfermeria:[],indicaciones:[],archivos:[]};
const input="w-full rounded-xl border border-line bg-white px-3 py-2.5 text-ink";
const boton="min-h-11 rounded-xl bg-navy px-4 py-2 font-semibold text-white";
const hoy=()=>new Date().toISOString().slice(0,16);
const id=()=>Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,7);
function edad(fecha:string){if(!fecha)return "Sin dato";const d=new Date(fecha+"T12:00:00");if(isNaN(d.getTime()))return "Sin dato";const n=new Date();let a=n.getFullYear()-d.getFullYear();if(n.getMonth()<d.getMonth()||(n.getMonth()===d.getMonth()&&n.getDate()<d.getDate()))a--;return a+" años";}
export default function FichaClinica({paciente:p}:{paciente:PacienteInfo}){
 const [datos,setDatos]=useState<Datos>(inicial),[cargado,setCargado]=useState(false);
 const [tab,setTab]=useState<Tab>("Historia clínica"),[accion,setAccion]=useState<"vitales"|"registro"|"indicacion"|"foto"|"documento"|null>(null);
 const [vital,setVital]=useState<Vital>({fecha:hoy(),ta:"",fc:"",fr:"",sat:"",glucemia:"",temp:"",peso:"",talla:""});
 const [titulo,setTitulo]=useState(""),[detalle,setDetalle]=useState("");
 const [med,setMed]=useState({farmaco:"",dosis:"",via:"",frecuencia:"",prescriptor:"",desde:"",hasta:""});
 const [archivo,setArchivo]=useState("");
 const [error,setError]=useState("");
 const clave="vitalis-ficha-clinica-08c-v2-"+p.id;
 useEffect(()=>{setCargado(false);try{const v=localStorage.getItem(clave);const x=v?JSON.parse(v):{};const base=datosClinicosIniciales(p.id);setDatos({vitales:Array.isArray(x.vitales)&&x.vitales.length?x.vitales:(base?.vitales||[]),enfermeria:Array.isArray(x.enfermeria)&&x.enfermeria.length?x.enfermeria:(base?.enfermeria||[]),indicaciones:Array.isArray(x.indicaciones)&&x.indicaciones.length?x.indicaciones:(base?.indicaciones||[]),archivos:Array.isArray(x.archivos)&&x.archivos.length?x.archivos:(base?.archivos||[])});}catch{setDatos(inicial);}setTab("Historia clínica");setAccion(null);setCargado(true);},[clave]);
 useEffect(()=>{if(cargado)try{localStorage.setItem(clave,JSON.stringify(datos));}catch{}},[datos,cargado,clave]);
 function iniciar(a:typeof accion,t:Tab){setAccion(a);setTab(t);setError("");}
 function guardar(e:React.FormEvent){e.preventDefault();if(accion==="vitales"){if(!Object.entries(vital).some(([k,v])=>k!=="fecha"&&v.trim())){setError("Ingresá al menos una medición.");return;}setDatos(d=>({...d,vitales:[{...vital},...d.vitales]}));setVital({fecha:hoy(),ta:"",fc:"",fr:"",sat:"",glucemia:"",temp:"",peso:"",talla:""});}
 if(accion==="registro"){if(!titulo.trim()||!detalle.trim()){setError("Completá título y descripción.");return;}setDatos(d=>({...d,enfermeria:[{id:id(),fecha:hoy(),titulo:titulo.trim(),detalle:detalle.trim()},...d.enfermeria]}));setTitulo("");setDetalle("");}
 if(accion==="indicacion"){if(!med.farmaco.trim()||!med.dosis.trim()||!med.prescriptor.trim()){setError("Completá medicamento, dosis y profesional prescriptor.");return;}setDatos(d=>({...d,indicaciones:[{...med,id:id()},...d.indicaciones]}));setMed({farmaco:"",dosis:"",via:"",frecuencia:"",prescriptor:"",desde:"",hasta:""});}
 if(accion==="foto"||accion==="documento"){if(!archivo.trim()){setError("Ingresá el nombre del archivo.");return;}setDatos(d=>({...d,archivos:[{id:id(),nombre:archivo.trim(),tipo:accion==="foto"?"Foto":"Documento",fecha:hoy()},...d.archivos]}));setArchivo("");}
 setAccion(null);setError("");
 }
 const ultimo=datos.vitales[0];
 const metricas:[string,string,string][]=[["Presión arterial",ultimo?.ta||"—","mmHg"],["Frecuencia cardíaca",ultimo?.fc||"—","lpm"],["Frecuencia respiratoria",ultimo?.fr||"—","rpm"],["Saturación O₂",ultimo?.sat||"—","%"],["Glucemia",ultimo?.glucemia||"—","mg/dL"],["Temperatura",ultimo?.temp||"—","°C"],["Peso",ultimo?.peso||"—","kg"],["Talla",ultimo?.talla||"—","cm"]];
 const camposVital:[keyof Vital,string,string][]=[["ta","Presión arterial","Ej. 120/80"],["fc","Frecuencia cardíaca","lpm"],["fr","Frecuencia respiratoria","rpm"],["sat","Saturación O₂","%"],["glucemia","Glucemia","mg/dL"],["temp","Temperatura","°C"],["peso","Peso","kg"],["talla","Talla","cm"]];
 const camposMed:[keyof typeof med,string][]=[["farmaco","Medicamento"],["dosis","Dosis"],["via","Vía de administración"],["frecuencia","Frecuencia"],["prescriptor","Profesional prescriptor"],["desde","Inicio"],["hasta","Finalización"]];
 return <div className="space-y-5">
 <div className="grid gap-4 xl:grid-cols-2">
  <section className="rounded-2xl border border-line bg-white p-4 md:p-5"><h3 className="mb-3 font-semibold text-navy">Información del paciente</h3><h4 className="font-display text-xl text-navy">{p.nombre} {p.apellido}</h4><p className="mb-4 text-sm text-ink-soft">{p.estado} · {edad(p.nacimiento)}</p><dl className="grid gap-3 sm:grid-cols-2">{([["Cédula",p.documento],["Nacimiento",p.nacimiento],["Teléfono",p.telefono],["Dirección",p.direccion],["Contacto de emergencia",p.emergencia],["Afiliado Vitalis",p.afiliado?"Sí":"No"],["Motivo de atención",p.motivo]] as const).map(([k,v])=><div key={k} className="min-w-0 rounded-xl bg-paper p-3"><dt className="text-xs text-ink-soft">{k}</dt><dd className="mt-1 break-words text-sm font-medium text-ink">{v||"Sin dato"}</dd></div>)}</dl></section>
  <section className="rounded-2xl border border-line bg-white p-4 md:p-5"><div className="mb-3 flex flex-wrap justify-between gap-2"><h3 className="font-semibold text-navy">Últimos signos vitales</h3><span className="text-xs text-ink-soft">{ultimo?.fecha?.replace("T"," ")||"Sin mediciones"}</span></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{metricas.map(([k,v,u])=><div key={k} className="rounded-xl bg-paper p-3"><p className="text-xs text-ink-soft">{k}</p><p className="mt-2 text-lg font-semibold text-navy">{v} <span className="text-xs font-normal">{v==="—"?"":u}</span></p></div>)}</div><p className="mt-3 text-xs text-ink-soft">Valores registrados, sin evaluación clínica automática.</p></section>
 </div>
 <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
  <button className={boton} onClick={()=>iniciar("vitales","Enfermería")}>❤️ Signos vitales</button>
  <button className={boton} onClick={()=>iniciar("indicacion","Indicaciones")}>💉 Medicación</button>
  <button className={boton} onClick={()=>iniciar("registro","Enfermería")}>📝 Nuevo registro</button>
  <button className={boton} onClick={()=>iniciar("foto","Fotografías")}>📷 Adjuntar foto</button>
 </div>
 <section className="min-w-0 rounded-2xl border border-line bg-white p-4 md:p-5">
  <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Secciones de ficha clínica">{tabs.map(t=><button key={t} type="button" aria-pressed={tab===t} className={tab===t?boton:"min-h-11 rounded-xl border border-line px-3 py-2 text-sm text-navy"} onClick={()=>{setTab(t);setAccion(null);}}>{t}</button>)}</div>
  {tab==="Historia clínica"&&<HistoriaClinica pacienteId={p.id}/>}
  {tab==="Enfermería"&&<div className="space-y-3"><div className="flex flex-wrap justify-between gap-2"><h3 className="font-semibold text-navy">Registros de enfermería</h3><div className="flex gap-2"><button className={boton} onClick={()=>iniciar("registro","Enfermería")}>Nuevo registro</button><button className={boton} onClick={()=>iniciar("vitales","Enfermería")}>Signos vitales</button></div></div>{datos.enfermeria.map(x=><article key={x.id} className="rounded-xl border border-line p-3"><p className="text-xs text-ink-soft">{x.fecha.replace("T"," ")}</p><h4 className="font-semibold">{x.titulo}</h4><p className="whitespace-pre-wrap text-sm">{x.detalle}</p></article>)}{datos.vitales.map((x,i)=><article key={x.fecha+i} className="rounded-xl border border-line p-3"><p className="text-xs text-ink-soft">{x.fecha.replace("T"," ")}</p><h4 className="font-semibold">Control de signos vitales</h4><p className="text-sm">{camposVital.filter(([k])=>x[k]).map(([k,n])=>n+": "+x[k]).join(" · ")}</p></article>)}{datos.enfermeria.length+datos.vitales.length===0&&<p className="text-sm text-ink-soft">Todavía no hay registros.</p>}</div>}
  {tab==="Indicaciones"&&<div className="space-y-3"><div className="flex flex-wrap justify-between gap-2"><h3 className="font-semibold text-navy">Indicaciones médicas</h3><button className={boton} onClick={()=>iniciar("indicacion","Indicaciones")}>Nueva indicación</button></div>{datos.indicaciones.map(x=><article key={x.id} className="rounded-xl border border-line p-3"><h4 className="font-semibold">{x.farmaco} · {x.dosis}</h4><p className="text-sm">{x.via} · {x.frecuencia}</p><p className="text-xs text-ink-soft">Prescriptor: {x.prescriptor} · {x.desde||"Sin inicio"} — {x.hasta||"Sin fin"}</p></article>)}{!datos.indicaciones.length&&<p className="text-sm text-ink-soft">Todavía no hay indicaciones.</p>}</div>}
  {(tab==="Fotografías"||tab==="Documentos")&&<div className="space-y-3"><div className="flex flex-wrap justify-between gap-2"><h3 className="font-semibold text-navy">{tab}</h3><button className={boton} onClick={()=>iniciar(tab==="Fotografías"?"foto":"documento",tab)}>Agregar {tab==="Fotografías"?"fotografía":"documento"}</button></div><p className="text-xs text-ink-soft">Se registran referencias de archivos; la carga multimedia estará disponible en otra etapa.</p>{datos.archivos.filter(a=>a.tipo===(tab==="Fotografías"?"Foto":"Documento")).map(a=><article key={a.id} className="rounded-xl border border-line p-3"><p className="font-medium">{a.nombre}</p><p className="text-xs text-ink-soft">{a.fecha.replace("T"," ")}</p></article>)}</div>}
  {tab==="Ubicación"&&<div className="space-y-3"><h3 className="font-semibold text-navy">Ubicación del paciente</h3><p className="text-sm">{p.direccion||"Dirección no registrada"}</p>{p.direccion&&<a className="inline-flex min-h-11 items-center rounded-xl border border-line px-4 font-semibold text-navy" href={"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(p.direccion)} target="_blank" rel="noopener noreferrer">Abrir dirección en Google Maps ↗</a>}<p className="text-xs text-ink-soft">La búsqueda utiliza la dirección registrada; todavía no se almacenan coordenadas GPS.</p></div>}
  {accion&&<form onSubmit={guardar} className="mt-5 space-y-3 rounded-xl border border-line bg-paper p-4"><div className="flex justify-between gap-2"><h3 className="font-semibold text-navy">{accion==="vitales"?"Registrar signos vitales":accion==="registro"?"Nuevo registro de enfermería":accion==="indicacion"?"Nueva indicación médica":accion==="foto"?"Registrar fotografía":"Registrar documento"}</h3><button type="button" className="text-sm text-navy underline" onClick={()=>setAccion(null)}>Cerrar</button></div>
   {accion==="vitales"&&<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><label className="text-sm">Fecha y hora<input className={input} type="datetime-local" value={vital.fecha} onChange={e=>setVital(v=>({...v,fecha:e.target.value}))}/></label>{camposVital.map(([k,n,ph])=><label key={k} className="text-sm">{n}<input className={input} placeholder={ph} value={vital[k]} onChange={e=>setVital(v=>({...v,[k]:e.target.value}))}/></label>)}</div>}
   {accion==="registro"&&<><label className="block text-sm">Prestación o título<input className={input} value={titulo} onChange={e=>setTitulo(e.target.value)}/></label><label className="block text-sm">Descripción<textarea className={input} rows={3} value={detalle} onChange={e=>setDetalle(e.target.value)}/></label></>}
   {accion==="indicacion"&&<div className="grid gap-3 sm:grid-cols-2">{camposMed.map(([k,n])=><label key={k} className="text-sm">{n}<input className={input} type={k==="desde"||k==="hasta"?"date":"text"} value={med[k]} onChange={e=>setMed(v=>({...v,[k]:e.target.value}))}/></label>)}</div>}
   {(accion==="foto"||accion==="documento")&&<label className="block text-sm">Nombre o referencia del archivo<input className={input} value={archivo} onChange={e=>setArchivo(e.target.value)}/></label>}
   {error&&<p role="alert" className="text-sm text-red-700">{error}</p>}<button className={boton} type="submit">Guardar</button>
  </form>}
 </section></div>;
}
