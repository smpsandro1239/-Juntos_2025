import { Injectable, signal } from '@angular/core';
import { EmergencyLocation } from '../models/emergency-location.model';

const MOCK_EMERGENCY_LOCATIONS: EmergencyLocation[] = [
  // Hospitals
  {
    id: 1,
    name: 'Hospital de Santa Maria',
    type: 'hospital',
    address: 'Av. Prof. Egas Moniz, 1649-035 Lisboa',
    phone: '217805000',
    location: { lat: 38.7513, lng: -9.1583 },
  },
  {
    id: 2,
    name: 'Hospital de São José',
    type: 'hospital',
    address: 'Rua José António Serrano, 1150-199 Lisboa',
    phone: '218841000',
    location: { lat: 38.7202, lng: -9.1384 },
  },
  {
    id: 3,
    name: 'Hospital da Luz Lisboa',
    type: 'hospital',
    address: 'Av. Lusíada 100, 1500-650 Lisboa',
    phone: '217104400',
    location: { lat: 38.7554, lng: -9.1865 },
  },
  // Pharmacies
  {
    id: 4,
    name: 'Farmácia Estácio',
    type: 'pharmacy',
    address: 'Av. da República 48C, 1050-195 Lisboa',
    phone: '217957682',
    location: { lat: 38.7368, lng: -9.1456 },
  },
  {
    id: 5,
    name: 'Farmácia Holon',
    type: 'pharmacy',
    address: 'Praça de Londres 2, 1000-192 Lisboa',
    phone: '218485291',
    location: { lat: 38.7390, lng: -9.1352 },
  },
  // Police
  {
    id: 6,
    name: 'PSP - 1ª Divisão',
    type: 'police',
    address: 'R. Capelo 13, 1200-224 Lisboa',
    phone: '213224300',
    location: { lat: 38.7093, lng: -9.1408 },
  },
  {
    id: 7,
    name: 'PSP - Comando Metropolitano de Lisboa',
    type: 'police',
    address: 'R. de Entrecampos 21, 1700-022 Lisboa',
    phone: '217654242',
    location: { lat: 38.7471, lng: -9.1481 },
  },
];


@Injectable({
  providedIn: 'root'
})
export class EmergencyService {

  private locations = signal<EmergencyLocation[]>(MOCK_EMERGENCY_LOCATIONS);
  
  allLocations = this.locations.asReadonly();

  constructor() { }
}
