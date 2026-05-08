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
  IonImg,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useCamera } from '../../hooks/useCamera';
import './SensorPages.css';

const CameraPage: React.FC = () => {
  const { permissionText, imageDataUrl, error, requestPermission, takePhoto, pickFromGallery } = useCamera();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Camera</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="sensor-content ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Camara y galeria</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>Permiso: {permissionText}</p>
            <div className="sensor-actions">
              <IonButton onClick={requestPermission}>Solicitar permiso</IonButton>
              <IonButton onClick={takePhoto} color="success">
                Tomar foto
              </IonButton>
              <IonButton onClick={pickFromGallery} fill="outline">
                Elegir de galeria
              </IonButton>
            </div>

            {imageDataUrl && (
              <div className="sensor-image-wrap">
                <IonImg src={imageDataUrl} alt="Foto capturada" />
              </div>
            )}

            {error && <IonText color="danger">{error}</IonText>}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default CameraPage;
