import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';

interface RouteParams {
  id?: string;
}

const TaskFormPage: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<RouteParams>();
  const isEditMode = Boolean(id);
  const { addTask, updateTask, getTaskById } = useTasks();

  const currentTask = id ? getTaskById(id) : undefined;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (currentTask) {
      setTitle(currentTask.title);
      setDescription(currentTask.description);
    }
  }, [currentTask]);

  if (isEditMode && !currentTask) {
    return <Redirect to="/tasks" />;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    if (isEditMode && id) {
      updateTask(id, { title, description });
    } else {
      addTask({ title, description });
    }

    history.replace('/tasks');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tasks" />
          </IonButtons>
          <IonTitle>{isEditMode ? 'Edit Task' : 'Add Task'}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit}>
          <IonItem>
            <IonLabel position="stacked">Title</IonLabel>
            <IonInput
              value={title}
              onIonChange={(event) => setTitle(event.detail.value ?? '')}
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Description</IonLabel>
            <IonTextarea
              value={description}
              onIonChange={(event) => setDescription(event.detail.value ?? '')}
              rows={6}
            />
          </IonItem>

          <IonButton type="submit" expand="block" className="ion-margin-top">
            {isEditMode ? 'Save Changes' : 'Create Task'}
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default TaskFormPage;
