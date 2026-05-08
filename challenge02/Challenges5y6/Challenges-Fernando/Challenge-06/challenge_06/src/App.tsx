import React, { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonSpinner,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { person, list, leaf, logOut } from 'ionicons/icons';
import { auth } from './services/firebaseConfig.js';
import { signOut } from 'firebase/auth';

import Login from './pages/Login';
import Contacts from './pages/Contacts';
import Tasks from './pages/Tasks';
import Fruits from './pages/Fruits';
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';
import './theme/variables.css';

setupIonicReact();

const MainTabs: React.FC<{ onLogout: () => Promise<void> }> = ({ onLogout }) => (
  <IonTabs>
    <IonRouterOutlet>
      <Route exact path="/app/contacts" component={Contacts} />
      <Route exact path="/app/tasks" component={Tasks} />
      <Route exact path="/app/fruits" component={Fruits} />
      <Route
        exact
        path="/app/logout"
        render={() => {
          onLogout();
          return <Redirect to="/login" />;
        }}
      />
      <Route exact path="/app">
        <Redirect to="/app/contacts" />
      </Route>
    </IonRouterOutlet>

    <IonTabBar slot="bottom">
      <IonTabButton tab="contacts" href="/app/contacts">
        <IonIcon icon={person} />
        Contacts
      </IonTabButton>
      <IonTabButton tab="tasks" href="/app/tasks">
        <IonIcon icon={list} />
        Tasks
      </IonTabButton>
      <IonTabButton tab="fruits" href="/app/fruits">
        <IonIcon icon={leaf} />
        Fruits
      </IonTabButton>
      <IonTabButton tab="logout" href="/app/logout">
        <IonIcon icon={logOut} />
        Logout
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <IonApp>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <IonSpinner name="bubbles" color="light" />
        </div>
      </IonApp>
    );
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route
            path="/login"
            exact
            render={() => (isAuthenticated ? <Redirect to="/app/contacts" /> : <Login />)}
          />

          <Route
            path="/app"
            render={() =>
              isAuthenticated ? <MainTabs onLogout={handleLogout} /> : <Redirect to="/login" />
            }
          />

          <Route exact path="/">
            <Redirect to={isAuthenticated ? '/app/contacts' : '/login'} />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
