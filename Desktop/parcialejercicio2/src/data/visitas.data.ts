export const MOCK_VISITAS = [
  {
    id: '1',
    pacienteId: 'p1',
    pacienteNombre: 'Carlos García',
    hora: '08:00',
    estado: 'pendiente' as const,
    motivo: 'Revisión general',
    direccion: 'Calle 1 #123',
    orden: 1
  },
  {
    id: '2',
    pacienteId: 'p2',
    pacienteNombre: 'María López',
    hora: '09:30',
    estado: 'pendiente' as const,
    motivo: 'Control de tensión',
    direccion: 'Calle 2 #456',
    orden: 2
  },
  {
    id: '3',
    pacienteId: 'p3',
    pacienteNombre: 'Pedro Martínez',
    hora: '11:00',
    estado: 'pendiente' as const,
    motivo: 'Dolor de cabeza',
    direccion: 'Calle 3 #789',
    orden: 3
  }
];