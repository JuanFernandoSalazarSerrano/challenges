import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import TareaForm from '../components/TareaForm';
import TareaList from '../components/TareaList';
import './Tab1.css';

import React, { useState } from 'react';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const Tab1: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleAddTask = (text: string) => {
    setTasks(prev => [
      ...prev,
      { id: Date.now(), text, completed: false }
    ]);
  };

  const handleCompleteTask = (id: number) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
            Administra tus tareas! Challenge 03 Federico
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large" style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 'bold' }}>
              Administra tus tareas! Challenge 03 Federico
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <div style={{ padding: 16 }}>
          <TareaForm onAdd={handleAddTask} />
          <TareaList tasks={tasks} onComplete={handleCompleteTask} onDelete={handleDeleteTask} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
