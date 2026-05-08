import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useLocalNotifications } from '../../hooks/useLocalNotifications';
import './SensorPages.css';

const LocalNotificationsPage: React.FC = () => {
  const { permissionText, lastMessage, error, requestPermission, scheduleDemoNotification } =
    useLocalNotifications();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Local Notifications</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="sensor-content ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Notificaciones locales</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>Permiso: {permissionText}</p>
            <div className="sensor-actions">
              <IonButton onClick={requestPermission}>Solicitar permiso</IonButton>
              <IonButton onClick={scheduleDemoNotification} color="success">
                Programar demo (+5s)
              </IonButton>
            </div>

            {lastMessage && <p>{lastMessage}</p>}
            {error && <IonText color="danger">{error}</IonText>}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default LocalNotificationsPage;
