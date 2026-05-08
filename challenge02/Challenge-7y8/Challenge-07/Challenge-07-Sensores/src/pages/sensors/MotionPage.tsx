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
import { useAccelerometer } from '../../hooks/useAccelerometer';
import './SensorPages.css';

const MotionPage: React.FC = () => {
  const { accelData, orientationData, activeSensor, error, startAccel, startOrientation, stopAll } =
    useAccelerometer();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Motion</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="sensor-content ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Acelerometro y orientacion</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>Sensor activo: {activeSensor}</p>
            <div className="sensor-actions">
              <IonButton onClick={startAccel} color="success">
                Escuchar accel
              </IonButton>
              <IonButton onClick={startOrientation}>
                Escuchar orientation
              </IonButton>
              <IonButton onClick={stopAll} fill="outline" color="medium">
                Detener
              </IonButton>
            </div>

            {accelData && (
              <div className="sensor-result">
                <p>x: {accelData.x}</p>
                <p>y: {accelData.y}</p>
                <p>z: {accelData.z}</p>
              </div>
            )}

            {orientationData && (
              <div className="sensor-result">
                <p>alpha: {orientationData.alpha}</p>
                <p>beta: {orientationData.beta}</p>
                <p>gamma: {orientationData.gamma}</p>
              </div>
            )}

            {error && <IonText color="danger">{error}</IonText>}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default MotionPage;
