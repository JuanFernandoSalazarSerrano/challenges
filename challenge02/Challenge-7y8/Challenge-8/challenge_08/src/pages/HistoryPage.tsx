import { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonModal,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/react';
import { trash, map, download } from 'ionicons/icons';
import { trackingService, TrackingRecord } from '../services/trackingService';
import { MapsComponent } from '../components/MapsComponent';
import './HistoryPage.css';

export const HistoryPage = () => {
  const [records, setRecords] = useState<TrackingRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<TrackingRecord | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    const data = await trackingService.getAllTracking();
    setRecords(data.sort((a, b) => b.startTime - a.startTime));
  };

  const handleDeleteRecord = async (id: string) => {
    await trackingService.deleteTracking(id);
    loadRecords();
  };

  const handleViewRecord = (record: TrackingRecord) => {
    setSelectedRecord(record);
    setShowModal(true);
  };

  const handleExport = async () => {
    const data = await trackingService.exportAsJSON();
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    element.setAttribute('download', `tracking-${new Date().toISOString().split('T')[0]}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatDuration = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  };

  if (records.length === 0) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Challenge 8 - Mapa con sensores</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="history-page">
          <div className="empty-state">
            <p>No hay recorridos guardados</p>
            <p>Inicia un seguimiento para ver el historial aqui</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Challenge 8 - Mapa con sensores</IonTitle>
          <IonButton slot="end" fill="clear" onClick={handleExport}>
            <IonIcon slot="icon-only" icon={download} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="history-page">
        <div className="records-container">
          {records.map((record) => (
            <IonCard key={record.id} className="record-card">
              <IonCardContent>
                <div className="record-header">
                  <div className="record-date">{record.date}</div>
                  <div className="record-time">{formatDate(record.startTime)}</div>
                </div>

                <IonList className="record-details">
                  <IonItem>
                    <IonLabel>
                      <p className="detail-label">Duracion</p>
                      <p className="detail-value">{formatDuration(record.duration)}</p>
                    </IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <p className="detail-label">Distancia</p>
                      <p className="detail-value">{record.distance} m</p>
                    </IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <p className="detail-label">Puntos</p>
                      <p className="detail-value">{record.positions.length}</p>
                    </IonLabel>
                  </IonItem>
                </IonList>

                <div className="record-actions">
                  <IonButton
                    size="small"
                    color="primary"
                    onClick={() => handleViewRecord(record)}
                  >
                    <IonIcon slot="start" icon={map} />
                    Ver
                  </IonButton>
                  <IonButton
                    size="small"
                    color="danger"
                    onClick={() => handleDeleteRecord(record.id)}
                  >
                    <IonIcon slot="start" icon={trash} />
                    Eliminar
                  </IonButton>
                </div>
              </IonCardContent>
            </IonCard>
          ))}
        </div>

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Detalle del recorrido</IonTitle>
              <IonButton slot="end" fill="clear" onClick={() => setShowModal(false)}>
                Cerrar
              </IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {selectedRecord && selectedRecord.positions.length > 0 && (
              <div className="detail-map-wrapper">
                <MapsComponent
                  latitude={selectedRecord.positions[0].latitude}
                  longitude={selectedRecord.positions[0].longitude}
                  markers={selectedRecord.positions.map((pos, idx) => ({
                    id: `pos-${idx}`,
                    latitude: pos.latitude,
                    longitude: pos.longitude,
                    label: `Punto ${idx + 1}`,
                  }))}
                />
              </div>
            )}
            {selectedRecord && (
              <IonCard className="detail-info">
                <IonCardContent>
                  <IonList>
                    <IonItem>
                      <IonLabel>
                        <p className="detail-label">Fecha</p>
                        <p className="detail-value">{selectedRecord.date}</p>
                      </IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonLabel>
                        <p className="detail-label">Hora de inicio</p>
                        <p className="detail-value">{formatDate(selectedRecord.startTime)}</p>
                      </IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonLabel>
                        <p className="detail-label">Duracion</p>
                        <p className="detail-value">{formatDuration(selectedRecord.duration)}</p>
                      </IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonLabel>
                        <p className="detail-label">Distancia</p>
                        <p className="detail-value">{selectedRecord.distance} m</p>
                      </IonLabel>
                    </IonItem>
                    <IonItem>
                      <IonLabel>
                        <p className="detail-label">Puntos totales</p>
                        <p className="detail-value">{selectedRecord.positions.length}</p>
                      </IonLabel>
                    </IonItem>
                  </IonList>
                </IonCardContent>
              </IonCard>
            )}
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};
