export interface TrackingRecord {
  id: string;
  date: string;
  startTime: number;
  endTime: number;
  positions: Array<{
    latitude: number;
    longitude: number;
    timestamp: number;
    speed: number | null;
  }>;
  distance: number;
  duration: number;
}

const TRACKING_KEY = 'tracking_history';

export const trackingService = {
  saveTracking: async (record: TrackingRecord): Promise<void> => {
    try {
      const history = localStorage.getItem(TRACKING_KEY);
      const records: TrackingRecord[] = history ? JSON.parse(history) : [];
      records.push(record);
      localStorage.setItem(TRACKING_KEY, JSON.stringify(records));
    } catch (error) {
      console.error('Error saving tracking:', error);
    }
  },

  getTrackingByDate: async (date: string): Promise<TrackingRecord[]> => {
    try {
      const history = localStorage.getItem(TRACKING_KEY);
      if (!history) return [];
      const records: TrackingRecord[] = JSON.parse(history);
      return records.filter((r) => r.date === date);
    } catch (error) {
      console.error('Error getting tracking:', error);
      return [];
    }
  },

  getAllTracking: async (): Promise<TrackingRecord[]> => {
    try {
      const history = localStorage.getItem(TRACKING_KEY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error getting all tracking:', error);
      return [];
    }
  },

  deleteTracking: async (id: string): Promise<void> => {
    try {
      const history = localStorage.getItem(TRACKING_KEY);
      if (!history) return;
      const records: TrackingRecord[] = JSON.parse(history);
      const filtered = records.filter((r) => r.id !== id);
      localStorage.setItem(TRACKING_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting tracking:', error);
    }
  },

  exportAsJSON: async (): Promise<string> => {
    try {
      const history = localStorage.getItem(TRACKING_KEY);
      return history || '[]';
    } catch (error) {
      console.error('Error exporting tracking:', error);
      return '[]';
    }
  },
};
