import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { AuthProvider } from './contexts/AuthContext';
import { TasksProvider } from './contexts/TasksContext';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TaskDetailPage from './pages/TaskDetailPage';
import TaskFormPage from './pages/TaskFormPage';
import TasksListPage from './pages/TasksListPage';
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

const AppRoutes: React.FC = () => {
  const { currentUser, loading } = useAuth();

  return (
    <IonRouterOutlet>
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/register" component={RegisterPage} />

      <Route
        exact
        path="/tasks"
        render={() =>
          loading ? null : currentUser ? <TasksListPage /> : <Redirect to="/login" />
        }
      />
      <Route
        exact
        path="/tasks/new"
        render={() =>
          loading ? null : currentUser ? <TaskFormPage /> : <Redirect to="/login" />
        }
      />
      <Route
        exact
        path="/tasks/edit/:id"
        render={() =>
          loading ? null : currentUser ? <TaskFormPage /> : <Redirect to="/login" />
        }
      />
      <Route
        exact
        path="/tasks/detail/:id"
        render={() =>
          loading ? null : currentUser ? <TaskDetailPage /> : <Redirect to="/login" />
        }
      />

      <Route exact path="/">
        <Redirect to="/tasks" />
      </Route>
    </IonRouterOutlet>
  );
};

const App: React.FC = () => (
  <IonApp>
    <AuthProvider>
      <TasksProvider>
        <IonReactRouter>
          <AppRoutes />
        </IonReactRouter>
      </TasksProvider>
    </AuthProvider>
  </IonApp>
);

export default App;
