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
import { useDevice } from '../../hooks/useDevice';
import './SensorPages.css';

const DevicePage: React.FC = () => {
  const { info, battery, deviceId, error, loadDeviceData } = useDevice();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Device</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="sensor-content ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Informacion del dispositivo</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="sensor-actions">
              <IonButton onClick={loadDeviceData}>Cargar informacion</IonButton>
            </div>

            {info && (
              <div className="sensor-result">
                <p>Modelo: {info.model}</p>
                <p>Fabricante: {info.manufacturer}</p>
                <p>SO: {info.operatingSystem}</p>
                <p>Version SO: {info.osVersion}</p>
                <p>Plataforma: {info.platform}</p>
                <p>ID: {deviceId}</p>
                <p>Bateria (%): {battery?.batteryLevel ?? 'N/A'}</p>
                <p>Cargando: {battery?.isCharging ? 'Si' : 'No'}</p>
              </div>
            )}

            {error && <IonText color="danger">{error}</IonText>}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default DevicePage;
