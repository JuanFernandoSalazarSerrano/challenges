import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import GeolocationPage from './pages/sensors/GeolocationPage';
import CameraPage from './pages/sensors/CameraPage';
import MotionPage from './pages/sensors/MotionPage';
import DevicePage from './pages/sensors/DevicePage';
import HapticsPage from './pages/sensors/HapticsPage';
import FilesystemPage from './pages/sensors/FilesystemPage';
import LocalNotificationsPage from './pages/sensors/LocalNotificationsPage';
import PushNotificationsPage from './pages/sensors/PushNotificationsPage';
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
      <IonRouterOutlet>
        <Route exact path="/home">
          <Home />
        </Route>
        <Route exact path="/geolocation">
          <GeolocationPage />
        </Route>
        <Route exact path="/camera">
          <CameraPage />
        </Route>
        <Route exact path="/motion">
          <MotionPage />
        </Route>
        <Route exact path="/device">
          <DevicePage />
        </Route>
        <Route exact path="/haptics">
          <HapticsPage />
        </Route>
        <Route exact path="/filesystem">
          <FilesystemPage />
        </Route>
        <Route exact path="/local-notifications">
          <LocalNotificationsPage />
        </Route>
        <Route exact path="/push-notifications">
          <PushNotificationsPage />
        </Route>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
