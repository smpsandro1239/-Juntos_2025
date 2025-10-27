export interface AlbumPhoto {
    imageUrl: string;
    activityName: string; // To link back to the activity
}

export interface Album {
    id: number;
    name: string;
    photos: AlbumPhoto[];
}
