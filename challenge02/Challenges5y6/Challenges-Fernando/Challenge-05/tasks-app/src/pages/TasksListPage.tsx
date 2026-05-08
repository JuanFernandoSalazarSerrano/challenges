import {
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { add, createOutline, eyeOutline, logOutOutline, trashOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';

const TasksListPage: React.FC = () => {
  const history = useHistory();
  const { currentUser, logout } = useAuth();
  const { tasks, deleteTask, toggleTaskCompleted } = useTasks();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tasks</IonTitle>
          <IonButtons slot="end">
            <IonButton routerLink="/tasks/new">
              <IonIcon icon={add} slot="start" />
              New
            </IonButton>
            <IonButton
              onClick={async () => {
                await logout();
                history.replace('/login');
              }}
            >
              <IonIcon icon={logOutOutline} slot="start" />
              Logout
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonNote>
          <p>Signed in as {currentUser?.email}</p>
        </IonNote>

        {tasks.length === 0 ? (
          <p>No tasks yet. Create your first one.</p>
        ) : (
          <IonList>
            {tasks.map((task) => (
              <IonItem key={task.id}>
                <IonLabel>
                  <h2>{task.title}</h2>
                  <p>{task.description || 'No description'}</p>
                  <IonBadge color={task.completed ? 'success' : 'medium'}>
                    {task.completed ? 'Completed' : 'Pending'}
                  </IonBadge>
                </IonLabel>

                <IonButton fill="clear" routerLink={`/tasks/detail/${task.id}`}>
                  <IonIcon icon={eyeOutline} />
                </IonButton>
                <IonButton fill="clear" routerLink={`/tasks/edit/${task.id}`}>
                  <IonIcon icon={createOutline} />
                </IonButton>
                <IonButton fill="clear" onClick={() => toggleTaskCompleted(task.id)}>
                  {task.completed ? 'Undo' : 'Done'}
                </IonButton>
                <IonButton fill="clear" color="danger" onClick={() => deleteTask(task.id)}>
                  <IonIcon icon={trashOutline} />
                </IonButton>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default TasksListPage;
