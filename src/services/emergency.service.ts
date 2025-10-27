import { Injectable, signal } from '@angular/core';
import { EmergencyLocation } from '../models/emergency-location.model';

const MOCK_EMERGENCY_LOCATIONS: EmergencyLocation[] = [
  // Hospitals
  { id: 1, name: 'Hospital de Santa Maria', type: 'Hospital', address: 'Av. Prof. Egas Moniz, Lisboa', phone: '217 805 000', location: { lat: 38.7513, lng: -9.1585 } },
  { id: 2, name: 'Hospital de São José', type: 'Hospital', address: 'Rua José António Serrano, Lisboa', phone: '218 841 000', location: { lat: 38.7196, lng: -9.1384 } },
  { id: 3, name: 'Hospital da Luz', type: 'Hospital', address: 'Av. Lusíada 100, Lisboa', phone: '217 104 400', location: { lat: 38.7554, lng: -9.1802 } },

  // Police
  { id: 4, name: 'PSP - 1ª Divisão', type: 'Police', address: 'R. Capelo, Lisboa', phone: '213 421 623', location: { lat: 38.7095, lng: -9.1415 } },
  { id: 5, name: 'PSP - 3ª Esquadra', type: 'Police', address: 'Largo do Mastro 25, Lisboa', phone: '218 854 430', location: { lat: 38.7202, lng: -9.1360 } },

  // Pharmacies
  { id: 6, name: 'Farmácia Estácio', type: 'Pharmacy', address: 'Praça Dom Pedro IV 101, Lisboa', phone: '213 422 581', location: { lat: 38.7138, lng: -9.1396 } },
  { id: 7, name: 'Farmácia Normal', type: 'Pharmacy', address: 'R. da Prata 199, Lisboa', phone: '218 878 123', location: { lat: 38.7112, lng: -9.1369 } },
];

@Injectable({
  providedIn: 'root'
})
export class EmergencyService {
  private locations = signal<EmergencyLocation[]>(MOCK_EMERGENCY_LOCATIONS);

  allLocations = this.locations.asReadonly();

  constructor() { }

  getLocationsByType(type: 'Hospital' | 'Police' | 'Pharmacy') {
    return this.locations().filter(loc => loc.type === type);
  }
}
