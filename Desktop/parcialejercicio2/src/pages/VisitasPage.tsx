import { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonAlert,
  IonReorderGroup,
  IonReorder,
  IonIcon,
  IonInput,
  IonBadge
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { arrowRedo, trash } from 'ionicons/icons';
import { Visita, EstadoVisita } from '../models';
import { MOCK_VISITAS } from '../data/visitas.data';
import './VisitasPage.css';

interface VisitasPageProps {
  onVisitasChange?: (visitas: Visita[]) => void;
}

const VisitasPage: React.FC<VisitasPageProps> = ({ onVisitasChange }) => {
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [filtro, setFiltro] = useState<string | 'todas'>('todas');
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [cancelingVisitaId, setCancelingVisitaId] = useState<string | null>(null);
  const [cancelMotivo, setCancelMotivo] = useState('');
  const history = useHistory();

  useEffect(() => {
    const storedVisitas = localStorage.getItem('visitas');
    if (storedVisitas) {
      try {
        setVisitas(JSON.parse(storedVisitas));
      } catch {
        const initialVisitas = MOCK_VISITAS.map((v, idx) => ({
          ...v,
          orden: idx + 1
        }));
        setVisitas(initialVisitas);
        localStorage.setItem('visitas', JSON.stringify(initialVisitas));
      }
    } else {
      const initialVisitas = MOCK_VISITAS.map((v, idx) => ({
        ...v,
        orden: idx + 1
      }));
      setVisitas(initialVisitas);
      localStorage.setItem('visitas', JSON.stringify(initialVisitas));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('visitas', JSON.stringify(visitas));
    onVisitasChange?.(visitas);
  }, [visitas, onVisitasChange]);

  const getFilteredVisitas = () => {
    if (filtro === 'todas') return visitas;
    return visitas.filter((v) => v.estado === filtro);
  };

  const sortedVisitas = (() => {
    const filtered = getFilteredVisitas();
    const pendientes = filtered.filter((v) => v.estado === EstadoVisita.PENDIENTE);
    const otras = filtered.filter((v) => v.estado !== EstadoVisita.PENDIENTE);
    return [...pendientes.sort((a, b) => a.orden - b.orden), ...otras];
  })();

  const handleEnCamino = (id: string) => {
    setVisitas((prev) =>
      prev.map((v) => (v.id === id ? { ...v, estado: EstadoVisita.EN_CAMINO } : v))
    );
  };

  const handleCancelClick = (id: string) => {
    setCancelingVisitaId(id);
    setCancelMotivo('');
    setShowCancelAlert(true);
  };

  const handleConfirmCancel = () => {
    if (cancelingVisitaId) {
      setVisitas((prev) =>
        prev.map((v) =>
          v.id === cancelingVisitaId
            ? {
                ...v,
                estado: EstadoVisita.CANCELADA,
                motivoCancelacion: cancelMotivo
              }
            : v
        )
      );
    }
    setShowCancelAlert(false);
    setCancelingVisitaId(null);
  };

  const handleReorder = (event: any) => {
    const newOrder = event.detail.complete(sortedVisitas);
    const updated = newOrder.map((v: Visita, idx: number) => ({
      ...v,
      orden: idx + 1
    }));
    setVisitas(updated);
  };

  const handleVerDetalle = (id: string) => {
    history.push(`/visitas/${id}`);
  };

  const pendientesCount = visitas.filter((v) => v.estado === EstadoVisita.PENDIENTE).length;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Agenda de Visitas</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonSegment
          value={filtro}
          onIonChange={(e) => setFiltro(e.detail.value as string | 'todas')}
          className="visitas-segment"
        >
          <IonSegmentButton value="todas">
            Todas
            <IonBadge color="primary">{visitas.length}</IonBadge>
          </IonSegmentButton>
          <IonSegmentButton value={EstadoVisita.PENDIENTE}>
            Pendientes
            <IonBadge color="warning">{pendientesCount}</IonBadge>
          </IonSegmentButton>
          <IonSegmentButton value={EstadoVisita.EN_CAMINO}>
            En camino
            <IonBadge color="secondary">
              {visitas.filter((v) => v.estado === EstadoVisita.EN_CAMINO).length}
            </IonBadge>
          </IonSegmentButton>
          <IonSegmentButton value={EstadoVisita.FINALIZADA}>
            Finalizadas
            <IonBadge color="success">
              {visitas.filter((v) => v.estado === EstadoVisita.FINALIZADA).length}
            </IonBadge>
          </IonSegmentButton>
        </IonSegment>

        <IonReorderGroup disabled={false} onIonItemReorder={handleReorder}>
          <IonList>
            {sortedVisitas.map((visita) => (
              <IonItemSliding key={visita.id}>
                <IonItemOptions side="start">
                  <IonItemOption
                    color="primary"
                    onClick={() => handleEnCamino(visita.id)}
                    expandable
                  >
                    En camino
                  </IonItemOption>
                  <IonItemOption
                    color="danger"
                    onClick={() => handleCancelClick(visita.id)}
                  >
                    Cancelar
                  </IonItemOption>
                </IonItemOptions>

                <IonItem button={visita.estado === EstadoVisita.PENDIENTE}>
                  <IonReorder slot="start" />
                  <IonLabel>
                    <h2>{visita.pacienteNombre}</h2>
                    <p>{visita.hora}</p>
                    <p>{visita.motivo}</p>
                    <p className="direccion">{visita.direccion}</p>
                  </IonLabel>
                  <div className={`estado estado-${visita.estado}`} slot="end">
                    {visita.estado === EstadoVisita.PENDIENTE && 'Pendiente'}
                    {visita.estado === EstadoVisita.EN_CAMINO && 'En camino'}
                    {visita.estado === EstadoVisita.FINALIZADA && 'Finalizada'}
                    {visita.estado === EstadoVisita.CANCELADA && 'Cancelada'}
                  </div>
                </IonItem>

                <IonItemOptions side="end">
                  <IonItemOption
                    color="secondary"
                    onClick={() => handleVerDetalle(visita.id)}
                    expandable
                  >
                    <IonIcon icon={arrowRedo} />
                    Ver detalle
                  </IonItemOption>
                </IonItemOptions>
              </IonItemSliding>
            ))}
          </IonList>
        </IonReorderGroup>
      </IonContent>

      <IonAlert
        isOpen={showCancelAlert}
        onDidDismiss={() => setShowCancelAlert(false)}
        header="Cancelar visita"
        message="Ingrese el motivo de la cancelación"
        buttons={[
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Confirmar',
            role: 'confirm',
            handler: handleConfirmCancel
          }
        ]}
        inputs={[
          {
            name: 'motivo',
            type: 'text',
            placeholder: 'Motivo de cancelación',
            value: cancelMotivo,
            handler: (e) => setCancelMotivo(e.value || '')
          }
        ]}
      />
    </IonPage>
  );
};

export default VisitasPage;
