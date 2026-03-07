import { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonAvatar,
  IonButton,
  IonIcon
} from '@ionic/react';
import { logOut } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { Doctor } from '../models';
import './Tab3.css';

const Tab3: React.FC = () => {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const history = useHistory();

  useEffect(() => {
    const storedDoctor = localStorage.getItem('doctor');
    if (storedDoctor) {
      try {
        setDoctor(JSON.parse(storedDoctor));
      } catch {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('doctor');
    localStorage.removeItem('isLoggedIn');
    history.push('/login');
  };

  if (!doctor) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Perfil</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen />
      </IonPage>
    );
  }

  const initials = `${doctor.nombre.charAt(0)}${doctor.apellido.charAt(0)}`.toUpperCase();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Mi Perfil</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonCard>
          <IonCardContent className="profile-card">
            <IonAvatar className="profile-avatar">
              <div className="avatar-initials">{initials}</div>
            </IonAvatar>
            <h2>{doctor.nombre} {doctor.apellido}</h2>
            <p className="specialty">{doctor.especialidad}</p>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Información Profesional</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="info-item">
              <span className="label">Cédula</span>
              <span className="value">{doctor.cedula}</span>
            </div>
            <div className="info-item">
              <span className="label">Especialidad</span>
              <span className="value">{doctor.especialidad}</span>
            </div>
          </IonCardContent>
        </IonCard>

        <IonButton
          expand="block"
          color="danger"
          onClick={handleLogout}
          className="logout-button"
        >
          <IonIcon icon={logOut} slot="start" />
          Cerrar Sesión
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
