import React, { useState } from 'react';
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
import { useDexie } from '../hooks/useDexie';
import '../styles/Fruits.css';

const Fruits = () => {
  const { data, loading, error, add, update, delete: deleteItem } = useDexie('fruits');
  
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [color, setColor] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleAddOrUpdate = async () => {
    if (!name || !quantity) {
      setAlertMessage('Please fill in all fields');
      setShowAlert(true);
      return;
    }

    try {
      if (editingId) {
        await update(editingId, { name, quantity: parseInt(quantity), color });
        setAlertMessage('Fruit updated successfully');
      } else {
        await add({ name, quantity: parseInt(quantity), color });
        setAlertMessage('Fruit added successfully');
      }
      resetForm();
      setShowToast(true);
    } catch (err) {
      setAlertMessage('Error: ' + err.message);
      setShowAlert(true);
    }
  };

  const handleEdit = (fruit) => {
    setEditingId(fruit.id);
    setName(fruit.name);
    setQuantity(fruit.quantity.toString());
    setColor(fruit.color || '');
  };

  const handleDelete = async (id) => {
    try {
      await deleteItem(id);
      setAlertMessage('Fruit deleted successfully');
      setShowToast(true);
    } catch (err) {
      setAlertMessage('Error: ' + err.message);
      setShowAlert(true);
    }
  };

  const resetForm = () => {
    setName('');
    setQuantity('');
    setColor('');
    setEditingId(null);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Fruits (Local Storage)</IonTitle>
          <div slot="end" className="local-badge">
            Local Database
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="content-background">
        <IonCard className="form-card">
          <IonCardHeader>
            <IonCardTitle>
              {editingId ? 'Edit Fruit' : 'Add New Fruit'}
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="form-group">
              <label>Fruit Name</label>
              <IonInput
                placeholder="e.g., Apple"
                value={name}
                onIonInput={(e) => setName(e.detail.value ?? '')}
              />
            </div>

            <div className="form-group">
              <label>Quantity</label>
              <IonInput
                type="number"
                placeholder="Number of fruits"
                value={quantity}
                onIonInput={(e) => setQuantity(e.detail.value ?? '')}
              />
            </div>

            <div className="form-group">
              <label>Color</label>
              <IonInput
                placeholder="Color (optional)"
                value={color}
                onIonInput={(e) => setColor(e.detail.value ?? '')}
              />
            </div>

            <IonButton
              expand="block"
              onClick={handleAddOrUpdate}
              disabled={loading}
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
            <IonCardTitle>Fruits List ({data.length})</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {loading && !data.length ? (
              <div className="loading">
                <IonSpinner />
              </div>
            ) : data.length === 0 ? (
              <p className="empty-message">No fruits yet. Add your first fruit!</p>
            ) : (
              <IonList>
                {data.map((fruit) => (
                  <IonItem key={fruit.id} className="fruit-item">
                    <IonLabel>
                      <h2>{fruit.name}</h2>
                      <p>Quantity: {fruit.quantity}</p>
                      {fruit.color && <p>Color: {fruit.color}</p>}
                    </IonLabel>
                    <IonButton
                      slot="end"
                      fill="clear"
                      size="small"
                      onClick={() => handleEdit(fruit)}
                    >
                      <IonIcon icon={create} />
                    </IonButton>
                    <IonButton
                      slot="end"
                      fill="clear"
                      size="small"
                      color="danger"
                      onClick={() => handleDelete(fruit.id)}
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

export default Fruits;
