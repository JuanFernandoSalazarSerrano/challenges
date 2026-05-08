import {
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';

interface RouteParams {
  id: string;
}

const TaskDetailPage: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<RouteParams>();
  const { getTaskById, deleteTask, toggleTaskCompleted } = useTasks();

  const task = getTaskById(id);

  if (!task) {
    return <Redirect to="/tasks" />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tasks" />
          </IonButtons>
          <IonTitle>Task Detail</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h1>{task.title}</h1>
        <IonBadge color={task.completed ? 'success' : 'medium'}>
          {task.completed ? 'Completed' : 'Pending'}
        </IonBadge>

        <IonText>
          <p>{task.description || 'No description provided.'}</p>
        </IonText>

        <IonText color="medium">
          <p>Created: {new Date(task.createdAt).toLocaleString()}</p>
          <p>Updated: {new Date(task.updatedAt).toLocaleString()}</p>
        </IonText>

        <IonButton expand="block" onClick={() => history.push(`/tasks/edit/${task.id}`)}>
          Edit
        </IonButton>
        <IonButton expand="block" fill="outline" onClick={() => toggleTaskCompleted(task.id)}>
          {task.completed ? 'Mark as Pending' : 'Mark as Completed'}
        </IonButton>
        <IonButton
          expand="block"
          color="danger"
          onClick={() => {
            deleteTask(task.id);
            history.replace('/tasks');
          }}
        >
          Delete Task
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default TaskDetailPage;
