import { useState } from 'react';
import { Patient } from '../models/patient';
import { User } from '../models/user';

interface TablaPacientesProps {
  pacientes: Patient[];
  onEditar: (paciente: Patient) => void;
  onEliminar: (id: string) => void;
  user: User;
}

export function TablaPacientes({ pacientes, onEditar, onEliminar, user }: TablaPacientesProps) {
  return (
    <div>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Nombre Completo</th>
            <th className="border border-gray-300 p-2">DNI</th>
            <th className="border border-gray-300 p-2">Teléfono</th>
            <th className="border border-gray-300 p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map((paciente) => (
            <tr key={paciente.id}>
              <td className="border border-gray-300 p-2">{paciente.nombre} {paciente.apellido}</td>
              <td className="border border-gray-300 p-2">{paciente.dni}</td>
              <td className="border border-gray-300 p-2">{paciente.telefono}</td>
              <td className="border border-gray-300 p-2">
                {user.role !== 'medico' && (
                  <button onClick={() => onEditar(paciente)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Editar</button>
                )}
                <button onClick={() => onEliminar(paciente.id)} className="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}