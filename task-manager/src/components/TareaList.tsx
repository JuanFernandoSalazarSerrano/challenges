import React from 'react';
import TareaItem from './TareaItem';

interface Tarea {
  id: number;
  text: string;
  completed: boolean;
}

interface TareaListProps {
  tasks: Tarea[];
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

const TareaList: React.FC<TareaListProps> = ({ tasks, onComplete, onDelete }) => {
  if (tasks.length === 0) return (
    <div style={{ textAlign: 'center', color: '#888', marginTop: 32 }}>
      <p>¡No hay tareas! Agrega una nueva para comenzar.</p>
    </div>
  );
  return (
    <div>
      {tasks.map(task => (
        <TareaItem
          key={task.id}
          task={task}
          onComplete={onComplete}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TareaList;
