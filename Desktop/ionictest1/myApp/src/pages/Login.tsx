import { IonContent, IonPage, IonButton, IonInput, IonItem, IonLabel, IonCard, IonCardContent } from '@ionic/react';
import { useState } from 'react';
import { useLoginPage } from './login.page';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin, handleLogOut } = useLoginPage();

  const onLoginClick = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  const onLogOutClick = () => {
    handleLogOut();
  };

  return (
    <IonPage>
      <IonContent fullscreen className="login-content">
        <div className="login-container">
          <IonCard className="login-card">
            <IonCardContent>
              <div className="login-header">
                <h1>Welcome Back</h1>
                <p>Sign in to your account</p>
              </div>

              <form className="login-form" onSubmit={onLoginClick}>
                <IonItem className="login-item">
                  <IonLabel position="floating">Email</IonLabel>
                  <IonInput
                    type="email"
                    value={email}
                    onIonChange={(e) => setEmail(e.detail.value || '')}
                    placeholder="Enter your email"
                    clearInput
                  />
                </IonItem>

                <IonItem className="login-item">
                  <IonLabel position="floating">Password</IonLabel>
                  <IonInput
                    type="password"
                    value={password}
                    onIonChange={(e) => setPassword(e.detail.value || '')}
                    placeholder="Enter your password"
                  />
                </IonItem>

                <div className="forgot-password">
                  <a href="#" className="forgot-link">Forgot Password?</a>
                </div>

                <IonButton
                  expand="block"
                  className="login-button"
                  type="submit"
                >
                  Sign In
                </IonButton>
              </form>

              <div className="signup-section">
                <p>Don't have an account? <a href="#" className="signup-link">Sign up</a></p>
              </div>
              {/* placeholder logout button, logic can be wired up later */}
              <IonButton
                expand="block"
                className="logout-button"
                onClick={() => { onLogOutClick() }}
              >
                Log Out
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
