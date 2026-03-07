import { useState, useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
  IonBadge
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { medicalSharp, people, personCircle } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
import LoginPage from './pages/LoginPage';
import { Visita, EstadoVisita } from './models';

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

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pendientesCount, setPendientesCount] = useState(0);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleVisitasChange = (visitas: Visita[]) => {
    const pendientes = visitas.filter((v) => v.estado === EstadoVisita.PENDIENTE).length;
    setPendientesCount(pendientes);
  };

  if (!isLoggedIn) {
    return (
      <IonApp>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route exact path="/login">
              <LoginPage onLogin={handleLogin} />
            </Route>
            <Route exact path="/">
              <Redirect to="/login" />
            </Route>
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    );
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route path="/visitas">
              <Tab1 onVisitasChange={handleVisitasChange} pendientesCount={pendientesCount} />
            </Route>
            <Route exact path="/pacientes">
              <Tab2 onVisitasChange={handleVisitasChange} />
            </Route>
            <Route exact path="/perfil">
              <Tab3 />
            </Route>
            <Route exact path="/">
              <Redirect to="/visitas" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="visitas" href="/visitas">
              <IonIcon aria-hidden="true" icon={medicalSharp} />
              <IonLabel>Visitas</IonLabel>
              {pendientesCount > 0 && <IonBadge color="danger">{pendientesCount}</IonBadge>}
            </IonTabButton>
            <IonTabButton tab="pacientes" href="/pacientes">
              <IonIcon aria-hidden="true" icon={people} />
              <IonLabel>Pacientes</IonLabel>
            </IonTabButton>
            <IonTabButton tab="perfil" href="/perfil">
              <IonIcon aria-hidden="true" icon={personCircle} />
              <IonLabel>Perfil</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
