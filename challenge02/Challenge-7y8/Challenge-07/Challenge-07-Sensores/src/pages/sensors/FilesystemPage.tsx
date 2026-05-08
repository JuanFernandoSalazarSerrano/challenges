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
  IonList,
  IonItem,
  IonLabel,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useFilesystem } from '../../hooks/useFilesystem';
import './SensorPages.css';

const FilesystemPage: React.FC = () => {
  const {
    permissionText,
    content,
    files,
    error,
    checkPermission,
    requestPermission,
    writeSampleFile,
    readSampleFile,
    listFiles,
    deleteSampleFile,
  } = useFilesystem();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Filesystem</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="sensor-content ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Archivos del dispositivo</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>Permiso: {permissionText}</p>
            <div className="sensor-actions">
              <IonButton onClick={checkPermission}>Check permiso</IonButton>
              <IonButton onClick={requestPermission}>Solicitar permiso</IonButton>
              <IonButton onClick={writeSampleFile} color="success">
                Escribir archivo
              </IonButton>
              <IonButton onClick={readSampleFile} fill="outline">
                Leer archivo
              </IonButton>
              <IonButton onClick={listFiles}>Listar archivos</IonButton>
              <IonButton onClick={deleteSampleFile} color="danger">
                Eliminar archivo
              </IonButton>
            </div>

            {content && (
              <div className="sensor-result">
                <p>{content}</p>
              </div>
            )}

            {files.length > 0 && (
              <IonList>
                {files.map((file) => (
                  <IonItem key={file}>
                    <IonLabel>{file}</IonLabel>
                  </IonItem>
                ))}
              </IonList>
            )}

            {error && <IonText color="danger">{error}</IonText>}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default FilesystemPage;
