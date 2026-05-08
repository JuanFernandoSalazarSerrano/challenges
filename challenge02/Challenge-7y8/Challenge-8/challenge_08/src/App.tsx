import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { map, list } from 'ionicons/icons';
import { TrackingPage } from './pages/TrackingPage';
import { HistoryPage } from './pages/HistoryPage';
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

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/tracking">
            <TrackingPage />
          </Route>
          <Route exact path="/history">
            <HistoryPage />
          </Route>
          <Route exact path="/">
            <Redirect to="/tracking" />
          </Route>
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="tracking" href="/tracking">
            <IonIcon icon={map} />
            <IonLabel>Mapa</IonLabel>
          </IonTabButton>
          <IonTabButton tab="history" href="/history">
            <IonIcon icon={list} />
            <IonLabel>Historial</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
