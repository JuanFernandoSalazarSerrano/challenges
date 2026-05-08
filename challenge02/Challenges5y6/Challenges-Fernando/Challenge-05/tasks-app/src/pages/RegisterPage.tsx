import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RegisterPage: React.FC = () => {
  const history = useHistory();
  const { currentUser, register, isFirebaseConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (currentUser) {
    return <Redirect to="/tasks" />;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setSubmitting(true);

    try {
      await register(email.trim(), password);
      history.replace('/tasks');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error while creating the account.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Register</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent>
            <form onSubmit={handleSubmit}>
              {!isFirebaseConfigured && (
                <IonText color="warning">
                  <p>Firebase is not configured yet. Local demo auth mode is active.</p>
                </IonText>
              )}

              <IonItem>
                <IonLabel position="stacked">Email</IonLabel>
                <IonInput
                  type="email"
                  value={email}
                  onIonChange={(event) => setEmail(event.detail.value ?? '')}
                  required
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Password</IonLabel>
                <IonInput
                  type="password"
                  value={password}
                  onIonChange={(event) => setPassword(event.detail.value ?? '')}
                  required
                />
              </IonItem>

              {error && (
                <IonText color="danger">
                  <p>{error}</p>
                </IonText>
              )}

              <IonButton type="submit" expand="block" className="ion-margin-top" disabled={submitting}>
                {submitting ? 'Creating account...' : 'Register'}
              </IonButton>
            </form>

            <IonText>
              <p>
                Already registered? <Link to="/login">Sign in</Link>
              </p>
            </IonText>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
