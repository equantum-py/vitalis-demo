import { VistaVisita } from "./vista-visita";

export default async function VisitaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <VistaVisita id={id} />;
}
