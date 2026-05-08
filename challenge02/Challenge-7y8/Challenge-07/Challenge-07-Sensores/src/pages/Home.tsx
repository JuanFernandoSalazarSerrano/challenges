import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  const history = useHistory();

  const items = [
    { label: 'Geolocalizacion', path: '/geolocation' },
    { label: 'Camara', path: '/camera' },
    { label: 'Movimiento', path: '/motion' },
    { label: 'Dispositivo', path: '/device' },
    { label: 'Vibracion', path: '/haptics' },
    { label: 'Sistema de archivos', path: '/filesystem' },
    { label: 'Notificaciones locales', path: '/local-notifications' },
    { label: 'Notificaciones push', path: '/push-notifications' },
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="home-toolbar">
          <IonTitle>Challenge-07-Sensores</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="home-content ion-padding">
        <div className="home-hero">
          <h1>Challenge 07 - Implementacion de sensores</h1>
          <p>Prueba el sensor que quieres usar!</p>
        </div>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Sensores disponibles</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="sensor-grid">
              {items.map((item) => (
                <IonButton key={item.path} expand="block" onClick={() => history.push(item.path)}>
                  {item.label}
                </IonButton>
              ))}
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Home;
