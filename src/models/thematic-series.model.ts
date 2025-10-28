export interface PassportStamp {
    id: number; // Corresponds to activity ID
    name: string;
    imageUrl: string;
    collected: boolean;
}

export interface ThematicSeries {
    id: number;
    name:string;
    description: string;
    stamps: PassportStamp[];
}
