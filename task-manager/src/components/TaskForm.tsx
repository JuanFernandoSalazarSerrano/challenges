import React, { useState } from 'react';
import { IonInput, IonButton, IonItem } from '@ionic/react';

interface TaskFormProps {
  onAdd: (text: string) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAdd }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <IonItem style={{ maxWidth: 400, width: '100%' }}>
        <IonInput
          value={text}
          onIonChange={e => setText(e.detail.value!)}
          placeholder="Nueva tarea"
          style={{ textAlign: 'center' }}
        />
      </IonItem>
      <IonButton type="submit" expand="block" style={{ marginTop: 8, maxWidth: 200 }}>
        Agregar
      </IonButton>
    </form>
  );
};

export default TaskForm;
