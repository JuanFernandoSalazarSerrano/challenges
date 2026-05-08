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
import { usePushNotifications } from '../../hooks/usePushNotifications';
import './SensorPages.css';

const PushNotificationsPage: React.FC = () => {
  const { isNative, permissionText, token, lastNotification, error, registerForPush } =
    usePushNotifications();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Push Notifications</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="sensor-content ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Push nativo (Firebase/APNS)</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>Plataforma nativa: {isNative ? 'Si' : 'No (web)'}</p>
            <p>Permiso: {permissionText}</p>

            <div className="sensor-actions">
              <IonButton onClick={registerForPush} disabled={!isNative}>
                Registrar para push
              </IonButton>
            </div>

            {token && (
              <div className="sensor-result">
                <p>Token:</p>
                <p className="sensor-token">{token}</p>
              </div>
            )}

            {lastNotification && <p>Ultima notificacion: {lastNotification}</p>}
            {error && <IonText color="danger">{error}</IonText>}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default PushNotificationsPage;
