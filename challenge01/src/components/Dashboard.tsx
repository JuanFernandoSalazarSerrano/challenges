import { useState, useEffect } from 'react';
import { User } from '../models/user';
import { Patient } from '../models/patient';
import { FormularioPaciente } from './FormularioPaciente';
import { TablaPacientes } from './TablaPacientes';
import { BuscadorPacientes } from './BuscadorPacientes';

interface DashboardProps {
  user: User;
}

export function Dashboard({ user }: DashboardProps) {
  const [pacientes, setPacientes] = useState<Patient[]>([]);
  const [pacienteAEditar, setPacienteAEditar] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('medicare_pacientes');
    if (stored) {
      setPacientes(JSON.parse(stored));
    }
  }, []);

  const savePacientes = (newPacientes: Patient[]) => {
    setPacientes(newPacientes);
    localStorage.setItem('medicare_pacientes', JSON.stringify(newPacientes));
  };

  const handleGuardarPaciente = (paciente: Patient) => {
    let newPacientes;
    if (pacienteAEditar) {
      newPacientes = pacientes.map(p => p.id === paciente.id ? paciente : p);
    } else {
      newPacientes = [...pacientes, paciente];
    }
    savePacientes(newPacientes);
    setPacienteAEditar(null);
  };

  const handleEditarPaciente = (paciente: Patient) => {
    setPacienteAEditar(paciente);
  };

  const handleEliminarPaciente = (id: string) => {
    const newPacientes = pacientes.filter(p => p.id !== id);
    savePacientes(newPacientes);
  };

  const filteredPacientes = pacientes.filter(p =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.dni.includes(searchTerm)
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl mb-6">MediCare+ Dashboard</h1>
      {user.role === 'medico' && (
        <div className="mb-6">
          <h2 className="text-2xl mb-4">Estadísticas</h2>
          <p>Total de pacientes: {pacientes.length}</p>
        </div>
      )}
      <div className="mb-6">
        <h2 className="text-2xl mb-4">Gestión de Pacientes</h2>
        <BuscadorPacientes searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <TablaPacientes
          pacientes={filteredPacientes}
          onEditar={handleEditarPaciente}
          onEliminar={handleEliminarPaciente}
          user={user}
        />
      </div>
      {user.role === 'recepcionista' && (
        <div className="mb-6">
          <h2 className="text-2xl mb-4">Alta/Edición de Paciente</h2>
          <FormularioPaciente
            pacienteAEditar={pacienteAEditar}
            onGuardar={handleGuardarPaciente}
          />
        </div>
      )}
    </div>
  );
}