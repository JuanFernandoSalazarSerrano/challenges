import { useState, useEffect, useRef } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonSpinner,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
} from '@ionic/react';
import { play, stop, location, wifi } from 'ionicons/icons';
import { useGeolocation } from '../hooks/useGeolocation';
import { MapsComponent } from '../components/MapsComponent';
import { trackingService, TrackingRecord } from '../services/trackingService';
import { placesService, Place } from '../services/placesService';
import { sensorService, setupNetworkListener } from '../services/sensorService';
import './TrackingPage.css';

interface TrackingData {
  positions: Array<{
    latitude: number;
    longitude: number;
    timestamp: number;
    speed: number | null;
  }>;
  startTime: number;
}

export const TrackingPage = () => {
  const { position, watching, getCurrentPosition, startTracking, stopTracking } = useGeolocation();
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>([]);
  const [isMoving, setIsMoving] = useState(false);
  const [networkInfo, setNetworkInfo] = useState({ isConnected: false, isWiFi: false });
  const [battery, setBattery] = useState({ level: 100, isLow: false });
  const [address, setAddress] = useState('');
  const trackingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    getCurrentPosition();
  }, []);

  useEffect(() => {
    if (!position) return;
    setIsMoving(sensorService.checkDeviceMotion(position.speed));
  }, [position]);

  useEffect(() => {
    if (watching) {
      sensorService.vibrate(200);
      setTrackingData({
        positions: position
          ? [
              {
                latitude: position.latitude,
                longitude: position.longitude,
                timestamp: position.timestamp,
                speed: position.speed,
              },
            ]
          : [],
        startTime: Date.now(),
      });

      trackingIntervalRef.current = setInterval(async () => {
        const newBattery = await sensorService.getBatteryStatus();
        setBattery(newBattery);

        if (newBattery.isLow) {
          await stopTrackingSession();
          sensorService.notificationHaptic();
        }
      }, 10000);

      const checkNetwork = async () => {
        const net = await sensorService.checkNetworkStatus();
        setNetworkInfo(net);
      };
      checkNetwork();
      setupNetworkListener((connected, isWiFi) => {
        setNetworkInfo({ isConnected: connected, isWiFi });
      });
    } else {
      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
      }
    }

    return () => {
      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
      }
    };
  }, [watching]);

  useEffect(() => {
    if (watching && position) {
      setTrackingData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          positions: [
            ...prev.positions,
            {
              latitude: position.latitude,
              longitude: position.longitude,
              timestamp: position.timestamp,
              speed: position.speed,
            },
          ],
        };
      });

      if (nearbyPlaces.length === 0) {
        fetchNearbyPlaces();
      }
    }
  }, [position, watching]);

  useEffect(() => {
    if (position) {
      placesService.searchAddress(position.latitude, position.longitude).then(setAddress);
    }
  }, [position]);

  const fetchNearbyPlaces = async () => {
    if (!position) return;
    const places = await placesService.getNearestPlaces(position.latitude, position.longitude);
    setNearbyPlaces(places.slice(0, 5));
  };

  const handleStartTracking = async () => {
    await startTracking();
  };

  const stopTrackingSession = async () => {
    await stopTracking();

    if (trackingData && trackingData.positions.length > 0) {
      const record: TrackingRecord = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        startTime: trackingData.startTime,
        endTime: Date.now(),
        positions: trackingData.positions,
        distance: calculateTotalDistance(trackingData.positions),
        duration: Date.now() - trackingData.startTime,
      };
      await trackingService.saveTracking(record);
    }

    setTrackingData(null);
    setNearbyPlaces([]);
  };

  const calculateTotalDistance = (positions: Array<{ latitude: number; longitude: number }>) => {
    let total = 0;
    for (let i = 1; i < positions.length; i++) {
      const lat1 = positions[i - 1].latitude;
      const lon1 = positions[i - 1].longitude;
      const lat2 = positions[i].latitude;
      const lon2 = positions[i].longitude;

      const R = 6371;
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      total += R * c;
    }
    return Math.round(total * 1000);
  };

  if (!position) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Challenge 8 - Mapa con sensores</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="tracking-page">
          <div className="loading-container">
            <IonSpinner />
            <p>Obteniendo ubicacion...</p>
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
          <IonBadge slot="end" color={battery.isLow ? 'danger' : 'success'}>
            Bateria: {battery.level}%
          </IonBadge>
        </IonToolbar>
      </IonHeader>
      <IonContent className="tracking-page">
        <div className="map-wrapper">
          <MapsComponent
            latitude={position.latitude}
            longitude={position.longitude}
            radius={1000}
            showRadius={true}
          />
        </div>

        <IonCard className="info-card">
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol size="12">
                  <div className="location-info">
                    <IonIcon icon={location} />
                    <div>
                      <p className="label">Ubicacion</p>
                      <p className="value">{address}</p>
                    </div>
                  </div>
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol size="6">
                  <div className="status-info">
                    <p className="label">Precision</p>
                    <p className="value">{Math.round(position.accuracy)} m</p>
                  </div>
                </IonCol>
                <IonCol size="6">
                  <div className="status-info">
                    <p className="label">Velocidad</p>
                    <p className="value">{position.speed ? (position.speed * 3.6).toFixed(1) : 0} km/h</p>
                  </div>
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol size="6">
                  <div className={`status-info ${isMoving ? 'moving' : 'stationary'}`}>
                    <p className="label">Estado</p>
                    <p className="value">{isMoving ? 'En movimiento' : 'Sin movimiento'}</p>
                  </div>
                </IonCol>
                <IonCol size="6">
                  <div className={`status-info ${networkInfo.isWiFi ? 'connected' : 'disconnected'}`}>
                    <IonIcon icon={wifi} />
                    <p className="value">{networkInfo.isWiFi ? 'WiFi' : 'Datos moviles'}</p>
                  </div>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {trackingData && (
          <IonCard className="tracking-stats">
            <IonCardContent>
              <p className="label">Duracion: {Math.round((Date.now() - trackingData.startTime) / 1000)}s</p>
              <p className="label">
                Puntos: {trackingData.positions.length}
              </p>
            </IonCardContent>
          </IonCard>
        )}

        {nearbyPlaces.length > 0 && (
          <IonCard className="nearby-places">
            <IonCardContent>
              <h3>Lugares cercanos</h3>
              <IonList>
                {nearbyPlaces.map((place, index) => (
                  <IonItem key={index}>
                    <div className="place-info">
                      <p className="place-name">{place.name}</p>
                      <p className="place-distance">{place.distance} m</p>
                    </div>
                  </IonItem>
                ))}
              </IonList>
            </IonCardContent>
          </IonCard>
        )}

        <div className="button-group">
          {!watching ? (
            <IonButton expand="block" color="success" onClick={handleStartTracking}>
              <IonIcon slot="start" icon={play} />
              Iniciar seguimiento
            </IonButton>
          ) : (
            <IonButton expand="block" color="danger" onClick={stopTrackingSession}>
              <IonIcon slot="start" icon={stop} />
              Detener seguimiento
            </IonButton>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};
