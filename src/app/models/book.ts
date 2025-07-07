export interface Book {
    id?: string;
    title: string;
    author: string;
    year: number;
    publishDate: Date;
    imageUrl?: string;
    ownerId?: string; // ID del usuario propietario del libro
}
