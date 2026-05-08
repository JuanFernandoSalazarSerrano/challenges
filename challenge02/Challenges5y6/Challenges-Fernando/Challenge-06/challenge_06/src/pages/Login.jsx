import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonInput,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonSpinner,
  IonAlert,
} from '@ionic/react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="login-content">
        <div className="login-container">
          <IonCard className="login-card">
            <IonCardHeader>
              <IonCardTitle className="login-title">
                {isSignUp ? 'Create Account' : 'Challenge 06'}
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="form-group">
                <label>Email</label>
                <IonInput
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onIonInput={(e) => setEmail(e.detail.value ?? '')}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <IonInput
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onIonInput={(e) => setPassword(e.detail.value ?? '')}
                  disabled={loading}
                />
              </div>

              {loading && (
                <div className="loading-spinner">
                  <IonSpinner></IonSpinner>
                </div>
              )}

              <IonButton
                expand="block"
                onClick={handleLogin}
                disabled={loading}
                className="login-button"
              >
                {isSignUp ? 'Sign Up' : 'Login'}
              </IonButton>

              <IonButton
                expand="block"
                fill="clear"
                onClick={() => setIsSignUp(!isSignUp)}
                disabled={loading}
              >
                {isSignUp ? 'Already have an account? Login' : 'Create new account'}
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>

        <IonAlert
          isOpen={!!error}
          onDidDismiss={() => setError(null)}
          header="Error"
          message={error}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
