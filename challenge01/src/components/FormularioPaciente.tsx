import { useState, useEffect } from 'react';
import { Patient } from '../models/patient';

interface FormularioPacienteProps {
  pacienteAEditar: Patient | null;
  onGuardar: (paciente: Patient) => void;
}

export function FormularioPaciente({ pacienteAEditar, onGuardar }: FormularioPacienteProps) {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [telefono, setTelefono] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (pacienteAEditar) {
      setNombre(pacienteAEditar.nombre);
      setApellido(pacienteAEditar.apellido);
      setDni(pacienteAEditar.dni);
      setTelefono(pacienteAEditar.telefono);
    } else {
      setNombre('');
      setApellido('');
      setDni('');
      setTelefono('');
    }
    setErrors({});
  }, [pacienteAEditar]);

  const validate = () => {
    const newErrors: any  = {};
    if (!nombre.trim()) newErrors.nombre = 'Nombre es obligatorio';
    if (!apellido.trim()) newErrors.apellido = 'Apellido es obligatorio';
    if (!dni.trim()) newErrors.dni = 'DNI es obligatorio';
    else if (!/^\d{7,8}$/.test(dni)) newErrors.dni = 'DNI debe tener 7 u 8 dígitos';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const paciente: Patient = {
        id: pacienteAEditar ? pacienteAEditar.id : Date.now().toString(),
        nombre,
        apellido,
        dni,
        telefono,
      };
      onGuardar(paciente);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h3 className="text-xl mb-4">{pacienteAEditar ? 'Editar Paciente' : 'Alta Paciente'}</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium">Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full p-2 border rounded"
        />
        {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Apellido</label>
        <input
          type="text"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          className="w-full p-2 border rounded"
        />
        {errors.apellido && <p className="text-red-500 text-sm">{errors.apellido}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">DNI</label>
        <input
          type="text"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          className="w-full p-2 border rounded"
        />
        {errors.dni && <p className="text-red-500 text-sm">{errors.dni}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">Teléfono</label>
        <input
          type="text"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Guardar</button>
    </form>
  );
}