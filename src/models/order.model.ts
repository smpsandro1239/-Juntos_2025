import { Album } from './album.model';

export interface Order {
    id: number;
    date: string; // ISO 8601
    album: Album;
    coverType: 'Capa Mole' | 'Capa Dura';
    price: number;
    shippingAddress: {
        name: string;
        address: string;
        postalCode: string;
        city: string;
    };
}
