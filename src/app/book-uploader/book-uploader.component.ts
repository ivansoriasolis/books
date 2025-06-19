import { Component } from '@angular/core';
import { BookService } from '../services/book.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-uploader',
  imports: [CommonModule],
  templateUrl: './book-uploader.component.html',
  styleUrl: './book-uploader.component.css'
})
export class BookUploaderComponent {
  constructor(private bookService: BookService) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) {
      alert('No se seleccionó ningún archivo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const libros = JSON.parse(e.target.result);
        if (Array.isArray(libros)) {
          libros.forEach(libro => {
            this.bookService.addBook(libro)
              .then(() => console.log('Libro agregado:', libro.title))
              .catch(err => console.error('Error al agregar:', err));
          });
          alert('Libros cargados correctamente.');
        } else {
          alert('El archivo debe contener un array de libros.');
        }
      } catch (error) {
        alert('Error al leer el archivo JSON.');
        console.error(error);
      }
    };

    reader.readAsText(file);
  }
}
