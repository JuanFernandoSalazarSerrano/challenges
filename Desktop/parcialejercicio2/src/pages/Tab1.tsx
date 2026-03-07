import { useState } from 'react';
import { IonRouterOutlet, IonLabel } from '@ionic/react';
import { Route } from 'react-router-dom';
import VisitasPage from './VisitasPage';
import DetalleVisitaPage from './DetalleVisitaPage';
import { Visita } from '../models';
import './Tab1.css';

interface Tab1Props {
  pendientesCount?: number;
  onVisitasChange?: (visitas: Visita[]) => void;
}

const Tab1: React.FC<Tab1Props> = ({ onVisitasChange }) => {
  return (
    <>
      <IonRouterOutlet>
        <Route exact path="/visitas">
          <VisitasPage onVisitasChange={onVisitasChange} />
        </Route>
        <Route path="/visitas/:id">
          <DetalleVisitaPage />
        </Route>
      </IonRouterOutlet>
    </>
  );
};

export default Tab1;
