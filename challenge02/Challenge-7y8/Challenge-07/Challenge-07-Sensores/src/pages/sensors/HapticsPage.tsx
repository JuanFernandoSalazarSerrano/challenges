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
import { ImpactStyle, NotificationType } from '@capacitor/haptics';
import { useHaptics } from '../../hooks/useHaptics';
import './SensorPages.css';

const HapticsPage: React.FC = () => {
  const { error, triggerImpact, triggerNotification, vibrate } = useHaptics();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Haptics</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="sensor-content ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Feedback fisico</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="sensor-actions">
              <IonButton onClick={() => triggerImpact(ImpactStyle.Light)}>Impact Light</IonButton>
              <IonButton onClick={() => triggerImpact(ImpactStyle.Medium)}>Impact Medium</IonButton>
              <IonButton onClick={() => triggerImpact(ImpactStyle.Heavy)}>Impact Heavy</IonButton>
              <IonButton onClick={() => triggerNotification(NotificationType.Success)} color="success">
                Notif Success
              </IonButton>
              <IonButton onClick={() => triggerNotification(NotificationType.Warning)} color="warning">
                Notif Warning
              </IonButton>
              <IonButton onClick={() => triggerNotification(NotificationType.Error)} color="danger">
                Notif Error
              </IonButton>
              <IonButton onClick={vibrate} fill="outline">
                Vibrar
              </IonButton>
            </div>

            {error && <IonText color="danger">{error}</IonText>}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default HapticsPage;
