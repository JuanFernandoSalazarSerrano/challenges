import { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonList,
  IonIcon,
  IonAlert,
  IonToast,
  IonSpinner
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { trash, checkmark } from 'ionicons/icons';
import { Visita, Medicamento, Receta, EstadoVisita } from '../models';
import { MOCK_VISITAS } from '../data/visitas.data';
import { MOCK_PACIENTES } from '../data/pacientes.data';
import './DetalleVisitaPage.css';

interface RouteParams {
  id: string;
}

const DetalleVisitaPage: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const history = useHistory();
  const [visita, setVisita] = useState<Visita | null>(null);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [medicamentoNombre, setMedicamentoNombre] = useState('');
  const [medicamentoDosis, setMedicamentoDosis] = useState('');
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deletingMedId, setDeletingMedId] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    const storedVisitas = localStorage.getItem('visitas');
    let allVisitas: Visita[];

    if (storedVisitas) {
      try {
        allVisitas = JSON.parse(storedVisitas);
      } catch {
        allVisitas = MOCK_VISITAS;
      }
    } else {
      allVisitas = MOCK_VISITAS;
    }

    const found = allVisitas.find((v) => v.id === id);
    if (found) {
      setVisita(found);

      const storedRecetas = localStorage.getItem('recetas');
      let recetas: Receta[] = [];
      if (storedRecetas) {
        try {
          recetas = JSON.parse(storedRecetas);
        } catch {}
      }

      const receta = recetas.find((r) => r.visitaId === id);
      if (receta) {
        setMedicamentos(receta.medicamentos);
      }
    }
  }, [id]);

  const handleAgregarMedicamento = () => {
    if (!medicamentoNombre.trim() || !medicamentoDosis.trim()) {
      return;
    }

    const newMed: Medicamento = {
      id: Date.now().toString(),
      nombre: medicamentoNombre,
      dosis: medicamentoDosis
    };

    setMedicamentos([...medicamentos, newMed]);
    setMedicamentoNombre('');
    setMedicamentoDosis('');
  };

  const handleDeleteMedicamento = (medId: string) => {
    setDeletingMedId(medId);
    setShowDeleteAlert(true);
  };

  const confirmDeleteMedicamento = () => {
    if (deletingMedId) {
      setMedicamentos(medicamentos.filter((m) => m.id !== deletingMedId));
    }
    setShowDeleteAlert(false);
    setDeletingMedId(null);
  };

  const handleFinalizarVisita = () => {
    if (!visita) return;

    const storedVisitas = localStorage.getItem('visitas');
    let allVisitas: Visita[] = [];

    if (storedVisitas) {
      try {
        allVisitas = JSON.parse(storedVisitas);
      } catch {
        allVisitas = MOCK_VISITAS;
      }
    } else {
      allVisitas = MOCK_VISITAS;
    }

    const updated = allVisitas.map((v) =>
      v.id === visita.id ? { ...v, estado: EstadoVisita.FINALIZADA } : v
    );
    localStorage.setItem('visitas', JSON.stringify(updated));

    const storedRecetas = localStorage.getItem('recetas');
    let recetas: Receta[] = [];
    if (storedRecetas) {
      try {
        recetas = JSON.parse(storedRecetas);
      } catch {}
    }

    const existingRecetaIndex = recetas.findIndex((r) => r.visitaId === visita.id);
    const receta: Receta = {
      id: existingRecetaIndex >= 0 ? recetas[existingRecetaIndex].id : Date.now().toString(),
      visitaId: visita.id,
      medicamentos
    };

    if (existingRecetaIndex >= 0) {
      recetas[existingRecetaIndex] = receta;
    } else {
      recetas.push(receta);
    }

    localStorage.setItem('recetas', JSON.stringify(recetas));
    setShowSuccessToast(true);

    setTimeout(() => {
      history.push('/visitas');
    }, 2000);
  };

  if (!visita) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonBackButton defaultHref="/visitas" />
            </IonButtons>
            <IonTitle>Detalle de Visita</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="loading-container">
            <IonSpinner name="circular" />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const paciente = MOCK_PACIENTES.find((p) => p.id === visita.pacienteId);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/visitas" />
          </IonButtons>
          <IonTitle>Detalle de Visita</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>{visita.pacienteNombre}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem lines="none">
              <IonLabel>
                <p className="label">Hora</p>
                <h3>{visita.hora}</h3>
              </IonLabel>
            </IonItem>
            <IonItem lines="none">
              <IonLabel>
                <p className="label">Motivo</p>
                <h3>{visita.motivo}</h3>
              </IonLabel>
            </IonItem>
            <IonItem lines="none">
              <IonLabel>
                <p className="label">Dirección</p>
                <h3>{visita.direccion}</h3>
              </IonLabel>
            </IonItem>
            {paciente && (
              <>
                <IonItem lines="none">
                  <IonLabel>
                    <p className="label">Teléfono</p>
                    <h3>{paciente.telefono}</h3>
                  </IonLabel>
                </IonItem>
                <IonItem lines="none">
                  <IonLabel>
                    <p className="label">Cédula</p>
                    <h3>{paciente.cedula}</h3>
                  </IonLabel>
                </IonItem>
              </>
            )}
            <IonItem lines="none">
              <IonLabel>
                <p className="label">Estado</p>
                <h3 className={`estado estado-${visita.estado}`}>
                  {visita.estado === EstadoVisita.PENDIENTE && 'Pendiente'}
                  {visita.estado === EstadoVisita.EN_CAMINO && 'En camino'}
                  {visita.estado === EstadoVisita.FINALIZADA && 'Finalizada'}
                  {visita.estado === EstadoVisita.CANCELADA && 'Cancelada'}
                </h3>
              </IonLabel>
            </IonItem>
          </IonCardContent>
        </IonCard>

        {visita.estado !== EstadoVisita.CANCELADA && visita.estado !== EstadoVisita.FINALIZADA && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Receta - Medicamentos</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="form-group">
                <IonItem>
                  <IonLabel position="floating">Nombre del medicamento</IonLabel>
                  <IonInput
                    value={medicamentoNombre}
                    onIonChange={(e) => setMedicamentoNombre(e.detail.value || '')}
                    placeholder="Ej: Amoxicilina"
                  />
                </IonItem>
              </div>

              <div className="form-group">
                <IonItem>
                  <IonLabel position="floating">Dosis</IonLabel>
                  <IonInput
                    value={medicamentoDosis}
                    onIonChange={(e) => setMedicamentoDosis(e.detail.value || '')}
                    placeholder="Ej: 500mg cada 8 horas"
                  />
                </IonItem>
              </div>

              <IonButton
                expand="block"
                color="primary"
                onClick={handleAgregarMedicamento}
                disabled={!medicamentoNombre.trim() || !medicamentoDosis.trim()}
              >
                Agregar Medicamento
              </IonButton>

              {medicamentos.length > 0 && (
                <div className="medicamentos-list">
                  <h4>Medicamentos agregados:</h4>
                  <IonList>
                    {medicamentos.map((med) => (
                      <IonItem key={med.id}>
                        <IonLabel>
                          <h3>{med.nombre}</h3>
                          <p>{med.dosis}</p>
                        </IonLabel>
                        <IonButton
                          fill="clear"
                          color="danger"
                          slot="end"
                          onClick={() => handleDeleteMedicamento(med.id)}
                        >
                          <IonIcon icon={trash} />
                        </IonButton>
                      </IonItem>
                    ))}
                  </IonList>
                </div>
              )}

              <IonButton
                expand="block"
                color="success"
                onClick={handleFinalizarVisita}
                className="finalizar-button"
              >
                <IonIcon icon={checkmark} slot="start" />
                Finalizar Visita
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}

        {visita.estado === EstadoVisita.CANCELADA && visita.motivoCancelacion && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle color="danger">Cancelada</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>Motivo: {visita.motivoCancelacion}</p>
            </IonCardContent>
          </IonCard>
        )}

        {visita.estado === EstadoVisita.FINALIZADA && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle color="success">Visita Finalizada</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {medicamentos.length > 0 && (
                <div>
                  <h4>Medicamentos prescritos:</h4>
                  <IonList>
                    {medicamentos.map((med) => (
                      <IonItem key={med.id} lines="inset">
                        <IonLabel>
                          <h3>{med.nombre}</h3>
                          <p>{med.dosis}</p>
                        </IonLabel>
                      </IonItem>
                    ))}
                  </IonList>
                </div>
              )}
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>

      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={() => setShowDeleteAlert(false)}
        header="Eliminar medicamento"
        message="¿Está seguro de que desea eliminar este medicamento?"
        buttons={[
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Eliminar',
            role: 'confirm',
            handler: confirmDeleteMedicamento,
            cssClass: 'alert-danger'
          }
        ]}
      />

      <IonToast
        isOpen={showSuccessToast}
        onDidDismiss={() => setShowSuccessToast(false)}
        message="Visita finalizada correctamente"
        duration={2000}
        color="success"
        position="top"
      />
    </IonPage>
  );
};

export default DetalleVisitaPage;
