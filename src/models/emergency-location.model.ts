export interface EmergencyLocation {
  id: number;
  name: string;
  type: 'Hospital' | 'Police' | 'Pharmacy';
  address: string;
  phone: string;
  location: {
    lat: number;
    lng: number;
  };
}
