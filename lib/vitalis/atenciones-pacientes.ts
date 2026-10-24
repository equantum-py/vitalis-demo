import { Atencion, atenciones, eventos } from "@/lib/vitalis/eventos";
export type PacienteEvento={
 id:string;nombre:string;apellido:string;documento:string;nacimiento:string;telefono:string;direccion:string;emergencia:string;afiliado:boolean;
 estado:"Activo";motivo:string;atencion:Atencion;eventoNombre:string;eventoLugar:string;
};
export function pacientesDeEventos():PacienteEvento[]{
 const cobertura=new Map(eventos().map(e=>[e.id,e]));
 return atenciones().map(a=>{
  const nombreCompleto=a.paciente.trim().split(/\s+/);
  const nombre=nombreCompleto.shift()||"Persona";
  const apellido=nombreCompleto.join(" ")||"Atendida";
  const ev=cobertura.get(a.eventoId);
  return {id:"evento-atencion-"+a.id,nombre,apellido,documento:a.documento.trim()||"AT-"+a.id,nacimiento:"",telefono:"",direccion:ev?.lugar||"",emergencia:"",afiliado:false,estado:"Activo" as const,motivo:a.motivo,atencion:a,eventoNombre:ev?.nombre||"Evento",eventoLugar:ev?.lugar||""};
 });
}
