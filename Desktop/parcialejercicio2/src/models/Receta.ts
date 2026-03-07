import { Medicamento } from './Medicamento';

export class Receta {
  id: string;
  visitaId: string;
  medicamentos: Medicamento[];
}