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
import { useGeolocation } from '../../hooks/useGeolocation';
import './SensorPages.css';

const GeolocationPage: React.FC = () => {
  const {
    permissionText,
    position,
    error,
    isWatching,
    requestPermission,
    getCurrentPosition,
    startWatching,
    stopWatching,
  } = useGeolocation();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Geolocation</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="sensor-content ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>GPS del telefono</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>Permiso: {permissionText}</p>
            <div className="sensor-actions">
              <IonButton onClick={requestPermission}>Solicitar permiso</IonButton>
              <IonButton onClick={getCurrentPosition} fill="outline">
                Obtener posicion actual
              </IonButton>
              <IonButton onClick={startWatching} color="success" disabled={isWatching}>
                Iniciar seguimiento
              </IonButton>
              <IonButton onClick={stopWatching} color="medium" disabled={!isWatching}>
                Detener seguimiento
              </IonButton>
            </div>

            {position && (
              <div className="sensor-result">
                <p>Lat: {position.coords.latitude}</p>
                <p>Lng: {position.coords.longitude}</p>
                <p>Altitud: {position.coords.altitude ?? 'N/A'}</p>
                <p>Velocidad: {position.coords.speed ?? 'N/A'}</p>
              </div>
            )}

            {error && <IonText color="danger">{error}</IonText>}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default GeolocationPage;
