import { VistaConfirmacion } from "./vista-confirmacion";

export default async function ConfirmacionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <VistaConfirmacion id={id} />;
}
