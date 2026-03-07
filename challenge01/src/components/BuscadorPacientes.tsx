interface BuscadorPacientesProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function BuscadorPacientes({ searchTerm, onSearchChange }: BuscadorPacientesProps) {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Buscar por nombre, apellido o DNI"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full p-2 border rounded"
      />
    </div>
  );
}