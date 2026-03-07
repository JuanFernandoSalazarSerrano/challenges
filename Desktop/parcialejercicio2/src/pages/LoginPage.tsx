import { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonIcon,
  IonLoading,
  IonCard,
  IonCardContent
} from '@ionic/react';
import { eye, eyeOff } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { MOCK_DOCTORS } from '../data/doctors.data';
import { Doctor } from '../models';
import './LoginPage.css';

interface LoginPageProps {
  onLogin?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleLogin = async () => {


    setLoading(true);

    setTimeout(() => {
      if (email === 'doctor@test.com' && password === 'password123') {
        const doctor: Doctor = MOCK_DOCTORS[0];
        localStorage.setItem('doctor', JSON.stringify(doctor));
        localStorage.setItem('isLoggedIn', 'true');
        setLoading(false);
        onLogin?.();
        history.push('/visitas');
      } else {
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Iniciar Sesión</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="login-content">
        <div className="login-container">
          <IonCard>
            <IonCardContent>
              <IonItem>
                <IonLabel position="floating">Email</IonLabel>
                <IonInput
                  type="email"
                  value={email}
                  onIonChange={(e) => setEmail(e.detail.value || '')}
                  placeholder="doctor@test.com"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Contraseña</IonLabel>
                <IonInput
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onIonChange={(e) => setPassword(e.detail.value || '')}
                  placeholder="password123"
                />
                <IonButton
                  fill="clear"
                  slot="end"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <IonIcon icon={showPassword ? eyeOff : eye} />
                </IonButton>
              </IonItem>

              <div className="login-button-container">
                <IonButton
                  expand="block"
                  color="primary"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  Iniciar Sesión
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        </div>

        <IonLoading isOpen={loading} message="Verificando credenciales..." />

      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
