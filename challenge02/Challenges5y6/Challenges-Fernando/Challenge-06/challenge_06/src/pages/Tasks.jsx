import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonSpinner,
  IonAlert,
  IonIcon,
  IonCheckbox,
  IonToast,
} from '@ionic/react';
import { trash, create } from 'ionicons/icons';
import { useRealTimeCollection } from '../hooks/useRealTimeCollection';
import { useNetwork } from '../hooks/useNetwork';
import '../styles/Tasks.css';

const Tasks = () => {
  const { data, loading, error, add, update, delete: deleteTask } = useRealTimeCollection('tasks');
  const { isOnline } = useNetwork();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleAddOrUpdate = async () => {
    if (!title) {
      setAlertMessage('Please fill in the title');
      setShowAlert(true);
      return;
    }

    if (!isOnline) {
      setAlertMessage('You are offline. Cannot sync with Firebase Realtime Database.');
      setShowAlert(true);
      return;
    }

    try {
      if (editingId) {
        const task = data.find(t => t.id === editingId);
        await update(editingId, { 
          title, 
          description,
          completed: task?.completed || false 
        });
        setAlertMessage('Task updated successfully');
      } else {
        await add({ title, description, completed: false });
        setAlertMessage('Task added successfully');
      }
      resetForm();
      setShowToast(true);
    } catch (err) {
      setAlertMessage('Error: ' + err.message);
      setShowAlert(true);
    }
  };

  const handleToggleComplete = async (task) => {
    if (!isOnline) {
      setAlertMessage('You are offline. Cannot update task.');
      setShowAlert(true);
      return;
    }

    try {
      await update(task.id, { ...task, completed: !task.completed });
    } catch (err) {
      setAlertMessage('Error: ' + err.message);
      setShowAlert(true);
    }
  };

  const handleEdit = (task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description || '');
  };

  const handleDelete = async (id) => {
    if (!isOnline) {
      setAlertMessage('You are offline. Cannot delete from Firebase.');
      setShowAlert(true);
      return;
    }

    try {
      await deleteTask(id);
      setAlertMessage('Task deleted successfully');
      setShowToast(true);
    } catch (err) {
      setAlertMessage('Error: ' + err.message);
      setShowAlert(true);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setEditingId(null);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tasks</IonTitle>
          <div slot="end" className="network-status">
            {isOnline ? (
              <span className="online-badge">● Online</span>
            ) : (
              <span className="offline-badge">● Offline (Read Only)</span>
            )}
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="content-background">
        <IonCard className="form-card">
          <IonCardHeader>
            <IonCardTitle>
              {editingId ? 'Edit Task' : 'Add New Task'}
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="form-group">
              <label>Title</label>
              <IonInput
                placeholder="Task title"
                value={title}
                onIonInput={(e) => setTitle(e.detail.value ?? '')}
                disabled={!isOnline}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <IonInput
                placeholder="Task description"
                value={description}
                onIonInput={(e) => setDescription(e.detail.value ?? '')}
                disabled={!isOnline}
              />
            </div>

            <IonButton
              expand="block"
              onClick={handleAddOrUpdate}
              disabled={loading || !isOnline}
            >
              {loading ? <IonSpinner name="crescent" /> : editingId ? 'Update' : 'Add'}
            </IonButton>

            {editingId && (
              <IonButton expand="block" fill="clear" onClick={resetForm} disabled={loading}>
                Cancel
              </IonButton>
            )}
          </IonCardContent>
        </IonCard>

        <IonCard className="list-card">
          <IonCardHeader>
            <IonCardTitle>Tasks List ({data.length})</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {loading && !data.length ? (
              <div className="loading">
                <IonSpinner />
              </div>
            ) : data.length === 0 ? (
              <p className="empty-message">No tasks yet</p>
            ) : (
              <IonList>
                {data.map((task) => (
                  <IonItem key={task.id} className="task-item">
                    <IonCheckbox
                      slot="start"
                      checked={task.completed}
                      onIonChange={() => handleToggleComplete(task)}
                      disabled={!isOnline}
                    />
                    <IonLabel>
                      <h2 style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                        {task.title}
                      </h2>
                      <p>{task.description}</p>
                    </IonLabel>
                    <IonButton
                      slot="end"
                      fill="clear"
                      size="small"
                      onClick={() => handleEdit(task)}
                      disabled={!isOnline}
                    >
                      <IonIcon icon={create} />
                    </IonButton>
                    <IonButton
                      slot="end"
                      fill="clear"
                      size="small"
                      color="danger"
                      onClick={() => handleDelete(task.id)}
                      disabled={!isOnline}
                    >
                      <IonIcon icon={trash} />
                    </IonButton>
                  </IonItem>
                ))}
              </IonList>
            )}
          </IonCardContent>
        </IonCard>
      </IonContent>

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header="Info"
        message={alertMessage}
        buttons={['OK']}
      />

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={alertMessage}
        duration={2000}
        position="top"
      />
    </IonPage>
  );
};

export default Tasks;
