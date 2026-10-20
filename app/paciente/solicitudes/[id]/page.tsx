import { VistaSeguimiento } from "./vista-seguimiento";

export default async function SeguimientoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <VistaSeguimiento id={id} />;
}
