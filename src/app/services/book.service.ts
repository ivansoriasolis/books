import { Injectable } from '@angular/core';
import { firstValueFrom, map, Observable } from 'rxjs';
import { Book } from '../models/book';
import { addDoc, collection, deleteDoc, doc, getDoc, setDoc, updateDoc, where } from 'firebase/firestore';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { CollectionReference } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  books: Book[] = [];
  titles: string[] = [];
  private booksRef;
  
  constructor(private firestore: Firestore) { 
    this.booksRef = collection(this.firestore, 'books'); // Crear una referencia a la colección 'books' en Firestore
   }

  getBooks(): Observable<Book[]> { // Obtener los libros de Firestore
    const data = collectionData(this.booksRef, { idField: 'id' }) // Obtener los datos de la colección 'books' y asignar el campo 'id' a cada libro
    return data  as Observable<Book[]>; // Se usa un Observable para que se actualice automáticamente cuando se agreguen, actualicen o eliminen libros en Firestore
  } 

  async addBook(book: Book) {
    const {id, ...bookData} = book; // Desestructurar el libro para eliminar el campo 'id' si existe
    await addDoc(this.booksRef, bookData); // Agregar un nuevo libro a la colección 'books' en Firestore
  }

  async getBookById(id: string): Promise<Book | undefined> {
    const bookDoc = doc(this.firestore, 'books', id ); // Crear una referencia al documento del libro
    const docSnap = await getDoc(bookDoc); // Obtener el documento del libro
    if (docSnap.exists()) {
      const data = docSnap.data() as Book; // Convertir los datos del documento a tipo Book
      return {...data, id: docSnap.id}; // Retornar el libro con su ID
    } 
    return undefined; // No se encontró el libro
  }

  async updateBook(id: string, book: Partial<Book>) {
    const bookRef = doc(this.firestore, 'books', id); // Crear una referencia al documento del libro
    await updateDoc(bookRef, book); // Actualizar el libro en Firestore
  }

  async deleteBook(id: string){
    const bookDoc = doc(this.firestore, 'books', id); // Crear una referencia al documento del libro
    await deleteDoc(bookDoc); // Eliminar el libro de Firestore
  }
}
