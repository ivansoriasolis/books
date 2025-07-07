import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../models/book';
import { addDoc, collection, deleteDoc, doc, getDoc, setDoc, updateDoc, where } from 'firebase/firestore';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { deleteObject, getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  books: Book[] = [];
  titles: string[] = [];
  private booksRef;

  constructor(private firestore: Firestore,
    private storage: Storage,
  ) {
    this.booksRef = collection(this.firestore, 'books'); // Crear una referencia a la colección 'books' en Firestore
  }

  getBooks(): Observable<Book[]> { // Obtener los libros de Firestore
    const data = collectionData(this.booksRef, { idField: 'id' }) // Obtener los datos de la colección 'books' y asignar el campo 'id' a cada libro
    return data as Observable<Book[]>; // Se usa un Observable para que se actualice automáticamente cuando se agreguen, actualicen o eliminen libros en Firestore
  }

  // Método para obtener los títulos de los libros
  async addImage(imageFile: File, userId: string): Promise<string> {
    if (imageFile) {
      const imagePath = `book-covers/${userId}/${Date.now()}-${imageFile.name}`; // Crear una ruta única para la imagen usando la marca de tiempo actual y el nombre del archivo
      const imageRef = ref(this.storage, imagePath); // Crear una referencia a la ubicación donde se almacenará la imagen en Firebase Storage
      await uploadBytes(imageRef, imageFile); // Subir el archivo de imagen a Firebase Storage
      return await getDownloadURL(imageRef); // Obtener la URL de descarga de la imagen después de subirla
    }
    return ''; // Si no hay archivo de imagen, retorna undefined
  }

  async addBook(book: Book, imageFile: File) {
    console.log('uid actual:', book.ownerId);
    book.imageUrl = await this.addImage(imageFile, book.ownerId!); // Llamar al método para agregar la imagen y obtener su URL
    const { id, ...bookData } = book; // Desestructurar el libro para eliminar el campo 'id' si existe
    addDoc(this.booksRef, bookData); // Agregar un nuevo libro a la colección 'books' en Firestore
  }

  async getBookById(id: string): Promise<Book | undefined> {
    const bookDoc = doc(this.firestore, 'books', id); // Crear una referencia al documento del libro
    const docSnap = await getDoc(bookDoc); // Obtener el documento del libro
    if (docSnap.exists()) {
      const data = docSnap.data() as Book; // Convertir los datos del documento a tipo Book
      return { ...data, id: docSnap.id }; // Retornar el libro con su ID
    }
    return undefined; // No se encontró el libro
  }

  async updateBook(id: string, book: Partial<Book>, imageFile?: File, oldUrl?: string) {
    const bookRef = doc(this.firestore, 'books', id); // Crear una referencia al documento del libro
    // Si hay nueva imagen, eliminar la anterior y subir la nueva
    if (imageFile) {
      if (oldUrl) {
        await this.deleteImageStorage(oldUrl);
        console.log('Imagen antigua eliminada:', oldUrl);
      }
      const newImageUrl = await this.addImage(imageFile, book.ownerId!); // Subir la nueva imagen y obtener su URL
      book.imageUrl = newImageUrl;
    } updateDoc(bookRef, book); // Actualizar el libro en Firestore
  }

  async deleteBook(id: string) {
    // Obtener el libro primero para conocer su imageUrl
    const book = await this.getBookById(id);
    if (!book) {
      console.error('No se encontró el libro');
      return;
    }

    // Si el libro tiene una imagen, eliminarla de Firebase Storage
    this.deleteImageStorage(book.imageUrl!); // Eliminar la imagen del libro de Firebase Storage

    // Eliminar el documento en Firestore
    const bookDoc = doc(this.firestore, 'books', id); // Crear una referencia al documento del libro
    deleteDoc(bookDoc); // Eliminar el libro de Firestore
  }

  async deleteImageStorage(imageUrl: string): Promise<void> {
    // Si tiene imagen, eliminarla de Storage
    if (imageUrl) {
      try {
        // Obtener la referencia desde la URL de descarga
        const imagePath = this.getImagePathFromUrl(imageUrl);
        const imageStorageRef = ref(this.storage, imagePath);
        await deleteObject(imageStorageRef);
        console.log('Imagen eliminada correctamente');
      } catch (error) {
        console.error('Error eliminando imagen:', error);
      }
    }
  }
  //
  getImagePathFromUrl(url: string): string {
    const startIndex = url.indexOf('/o/') + 3; //
    const endIndex = url.indexOf('?');
    const path = decodeURIComponent(url.substring(startIndex, endIndex));
    return path;
  }


}
