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
  IonToast,
} from '@ionic/react';
import { trash, create } from 'ionicons/icons';
import { useCollection } from '../hooks/useCollection';
import { useNetwork } from '../hooks/useNetwork';
import '../styles/Contacts.css';

const Contacts = () => {
  const { data, loading, error, getAll, add, update, remove } = useCollection('contacts');
  const { isOnline } = useNetwork();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmailState] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const firestoreMissing = typeof error === 'string' && error.includes("Database '(default)' not found");

  useEffect(() => {
    if (isOnline) {
      getAll();
    }
  }, [isOnline, getAll]);

  const handleAddOrUpdate = async () => {
    if (!name || !phone || !email) {
      setAlertMessage('Please fill in all fields');
      setShowAlert(true);
      return;
    }

    if (!isOnline) {
      setAlertMessage('You are offline. Cannot sync with Firebase.');
      setShowAlert(true);
      return;
    }

    if (firestoreMissing) {
      setAlertMessage('Firestore is not enabled in this Firebase project. Create Firestore database in Firebase Console.');
      setShowAlert(true);
      return;
    }

    try {
      setSubmitting(true);
      if (editingId) {
        await update(editingId, { name, phone, email });
        setAlertMessage('Contact updated successfully');
      } else {
        await add({ name, phone, email });
        setAlertMessage('Contact added successfully');
      }
      resetForm();
      setShowToast(true);
    } catch (err) {
      setAlertMessage('Error: ' + err.message);
      setShowAlert(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (contact) => {
    setEditingId(contact.id);
    setName(contact.name);
    setPhone(contact.phone);
    setEmailState(contact.email);
  };

  const handleDelete = async (id) => {
    if (!isOnline) {
      setAlertMessage('You are offline. Cannot delete from Firebase.');
      setShowAlert(true);
      return;
    }

    try {
      setSubmitting(true);
      await remove(id);
      setAlertMessage('Contact deleted successfully');
      setShowToast(true);
    } catch (err) {
      setAlertMessage('Error: ' + err.message);
      setShowAlert(true);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setPhone('');
    setEmailState('');
    setEditingId(null);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Contacts</IonTitle>
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
              {editingId ? 'Edit Contact' : 'Add New Contact'}
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="form-group">
              <label>Name</label>
              <IonInput
                placeholder="Contact name"
                value={name}
                onIonInput={(e) => setName(e.detail.value ?? '')}
                disabled={!isOnline}
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <IonInput
                placeholder="Phone number"
                value={phone}
                onIonInput={(e) => setPhone(e.detail.value ?? '')}
                disabled={!isOnline}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <IonInput
                type="email"
                placeholder="Email address"
                value={email}
                onIonInput={(e) => setEmailState(e.detail.value ?? '')}
                disabled={!isOnline}
              />
            </div>

            <IonButton
              expand="block"
              onClick={handleAddOrUpdate}
              disabled={submitting || !isOnline || firestoreMissing}
            >
              {submitting ? <IonSpinner name="crescent" /> : editingId ? 'Update' : 'Add'}
            </IonButton>

            {editingId && (
              <IonButton expand="block" fill="clear" onClick={resetForm} disabled={submitting}>
                Cancel
              </IonButton>
            )}
          </IonCardContent>
        </IonCard>

        <IonCard className="list-card">
          <IonCardHeader>
            <IonCardTitle>Contacts List ({data.length})</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {firestoreMissing && (
              <p className="error-message">Firestore database is not enabled for this project. Enable it in Firebase Console to use Contacts.</p>
            )}
            {loading && !data.length && !firestoreMissing ? (
              <div className="loading">
                <IonSpinner />
              </div>
            ) : data.length === 0 ? (
              <p className="empty-message">No contacts yet</p>
            ) : (
              <IonList>
                {data.map((contact) => (
                  <IonItem key={contact.id} className="contact-item">
                    <IonLabel>
                      <h2>{contact.name}</h2>
                      <p>{contact.phone}</p>
                      <p>{contact.email}</p>
                    </IonLabel>
                    <IonButton
                      slot="end"
                      fill="clear"
                      size="small"
                      onClick={() => handleEdit(contact)}
                      disabled={!isOnline}
                    >
                      <IonIcon icon={create} />
                    </IonButton>
                    <IonButton
                      slot="end"
                      fill="clear"
                      size="small"
                      color="danger"
                      onClick={() => handleDelete(contact.id)}
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

export default Contacts;
