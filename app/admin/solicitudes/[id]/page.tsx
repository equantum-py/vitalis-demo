import { VistaDetalleSolicitud } from "./vista/detalle";

export default async function DetalleSolicitudPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <VistaDetalleSolicitud id={id} />;
}
