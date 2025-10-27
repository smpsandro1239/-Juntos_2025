export interface EmergencyLocation {
  id: number;
  name: string;
  type: 'hospital' | 'pharmacy' | 'police';
  address: string;
  phone: string;
  location: {
    lat: number;
    lng: number;
  };
}
