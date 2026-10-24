// Registros de muestra con identidades inventadas. No representan pacientes reales.
const NOMBRES = [
["Ana María","González"],["Miguel","Acosta"],["Patricia","Duarte"],["José Luis","Ramírez"],["Gabriela","Ferreira"],
["Hugo","Villalba"],["Sofía","Martínez"],["Ricardo","Benítez"],["Claudia","Giménez"],["Diego","Fernández"],
["Mariela","Cáceres"],["Jorge","Rojas"],["Natalia","Vera"],["Óscar","López"],["Verónica","Sosa"],
["Francisco","Riveros"],["Silvia","Mendoza"],["Andrés","Caballero"],["Carolina","Ortiz"],["Alberto","Meza"],
["Mónica","Cardozo"],["Rubén","Aguirre"],["Elena","Ayala"],["Raúl","Valdez"],["Rocío","Franco"],
["Pedro","Arce"],["Noelia","Paredes"],["Víctor","Báez"],["Susana","Medina"],["Fernando","Morales"],
["Cecilia","Britez"],["Enrique","Núñez"],["Lorena","Espínola"],["Julio","Coronel"],["Teresa","Pereira"],
["Mario","Lezcano"],["Beatriz","Escobar"],["Cristian","Godoy"],["Adriana","Barrios"],["Gustavo","Insfrán"],
["Liliana","Almirón"],["Daniel","Peralta"],["Paola","Fleitas"],["Héctor","Sanabria"],["Rosa","Amarilla"],
["Esteban","Zárate"],["Gloria","Ocampos"],["Fabián","Salinas"],["María José","Velázquez"],["Luis","Torres"]
] as const;
const BARRIOS = ["San Pablo, Asunción","Villa Morra, Asunción","Centro, Luque","San Lorenzo, Central","Lambaré, Central","Fernando de la Mora, Central","Capiatá, Central","Mariano Roque Alonso, Central","Ñemby, Central","Itauguá, Central"];
const ESTADOS = ["Activo","Internación domiciliaria","Activo","Activo","Alta","Activo","Internación domiciliaria","Suspendido","Activo","Inactivo"] as const;
const MOTIVOS = ["Seguimiento domiciliario","Control general","Cuidados de enfermería","Evaluación periódica","Seguimiento de curación"];
export const PACIENTES_INICIALES_50 = NOMBRES.map(([nombre,apellido],i)=>({
 id:"vitalis-pac-"+String(i+1).padStart(3,"0"),nombre,apellido,
 documento:"PAC-"+String(i+101).padStart(3,"0"),
 nacimiento:`${1955+(i*7)%48}-${String(1+(i*5)%12).padStart(2,"0")}-${String(1+(i*11)%27).padStart(2,"0")}`,
 telefono:"000 "+String(100+i).padStart(3,"0")+" "+String(200+i).padStart(3,"0"),
 direccion:"Zona "+String(1+i%12)+", "+BARRIOS[i%BARRIOS.length],
 emergencia:"Contacto responsable · 000 "+String(400+i).padStart(3,"0")+" "+String(500+i).padStart(3,"0"),
 afiliado:i%3!==0,estado:ESTADOS[i%ESTADOS.length],motivo:MOTIVOS[i%MOTIVOS.length]
}));
export const esPacienteInicial50 = (id:string)=>id.startsWith("vitalis-pac-")&&/^vitalis-pac-\\d{3}$/.test(id);
export function datosClinicosIniciales(id:string){
 const indice=Number(id.slice(-3))-1;
 if(!esPacienteInicial50(id)||indice<0||indice>=50)return null;
 const fecha="2026-10-"+String(10+indice%14).padStart(2,"0")+"T09:30";
 return {
  vitales:[{fecha,ta:`${112+indice%15}/${72+indice%10}`,fc:String(68+indice%22),fr:String(14+indice%7),sat:String(96+indice%4),glucemia:String(85+indice%30),temp:(36.1+(indice%9)/10).toFixed(1),peso:String(58+indice%34),talla:String(150+indice%35)}],
  enfermeria:[{id:"enf-inicial-"+id,fecha,titulo:"Control de enfermería",detalle:"Seguimiento de rutina registrado para presentación de la ficha."}],
  indicaciones:[{id:"ind-inicial-"+id,farmaco:"Plan de cuidados",dosis:"Según evaluación",via:"Seguimiento",frecuencia:"Control programado",prescriptor:"Profesional responsable",desde:"2026-10-10",hasta:"2026-11-10"}],
  archivos:[{id:"foto-inicial-"+id,nombre:"Seguimiento fotográfico pendiente",tipo:"Foto" as const,fecha},{id:"doc-inicial-"+id,nombre:"Ficha de ingreso",tipo:"Documento" as const,fecha}]
 };
}
export function historiaInicial50(id:string){
 if(!esPacienteInicial50(id))return null;
 const fecha="2026-10-"+String(10+(Number(id.slice(-3))-1)%14).padStart(2,"0");
 return [
  {id:"hc-antecedente-"+id,seccion:"Antecedentes" as const,fecha,titulo:"Antecedentes generales",detalle:"Sin antecedentes adicionales consignados en el registro inicial."},
  {id:"hc-evolucion-"+id,seccion:"Evolución" as const,fecha,titulo:"Seguimiento de enfermería",detalle:"Evaluación periódica registrada en la ficha."},
  {id:"hc-alergias-"+id,seccion:"Alergias" as const,fecha,titulo:"Alergias",detalle:"Información pendiente de confirmación."}
 ];
}
