import { EstadoVisita } from './EstadoVisita';

export class Visita {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  hora: string;
  estado: string;
  motivo: string;
  direccion: string;
  orden: number;
  motivoCancelacion?: string;
}