export type Evento={id:string;nombre:string;lugar:string;inicio:string;fin:string;asignados:string[];creado:string};
export type Atencion={id:string;eventoId:string;enfermeroId:string;enfermero:string;paciente:string;documento:string;motivo:string;prestacion:string;ta:string;fc:string;fr:string;sat:string;glucemia:string;temp:string;peso:string;talla:string;resultado:"Atendido"|"Derivado"|"Trasladado";fecha:string};
export type FuncionarioEvento={id:string;nombre:string;apellido:string;rol:string;activo:boolean;matricula?:string};
export const EVENTOS_KEY="vitalis-eventos-09-v1",ATENCIONES_KEY="vitalis-atenciones-09-v1",FUNCIONARIOS_KEY="vitalis-demo-funcionarios-08b";
export const EVENTO_INICIAL:Evento={id:"evt-inicial",nombre:"Cobertura deportiva",lugar:"Complejo deportivo",inicio:"2026-10-25T15:00",fin:"2026-10-25T21:00",asignados:["func-demo-3"],creado:"2026-10-24T12:00"};
export function leer<T>(clave:string,defecto:T):T{if(typeof window==="undefined")return defecto;try{const x=localStorage.getItem(clave);return x?JSON.parse(x) as T:defecto;}catch{return defecto;}}
export function funcionarios():FuncionarioEvento[]{return leer<FuncionarioEvento[]>(FUNCIONARIOS_KEY,[{id:"func-demo-1",nombre:"Carlos",apellido:"Benítez",rol:"Administrador",activo:true},{id:"func-demo-2",nombre:"Laura",apellido:"Martínez",rol:"Supervisor",activo:true},{id:"func-demo-3",nombre:"Andrea",apellido:"Villalba",rol:"Enfermero",activo:true,matricula:"MAT-003"}]);}
export function eventos():Evento[]{return leer<Evento[]>(EVENTOS_KEY,[EVENTO_INICIAL]);}
export function atenciones():Atencion[]{return leer<Atencion[]>(ATENCIONES_KEY,[]);}
export function guardar<T>(clave:string,valor:T){localStorage.setItem(clave,JSON.stringify(valor));window.dispatchEvent(new Event("vitalis-eventos-cambio"));}
export const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
