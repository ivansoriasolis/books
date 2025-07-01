import { JsonPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookService } from '../services/book.service';
import { yearValidator } from '../validators/custom-validator';
import { titleExistsValidator } from '../validators/async-validators';
import { ActivatedRoute, Router } from '@angular/router';
import { first, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-book-form-reactive',
  imports: [JsonPipe, NgIf, ReactiveFormsModule],
  templateUrl: './book-form-reactive.component.html',
  styleUrl: './book-form-reactive.component.css'
})
export class BookFormReactiveComponent {
  bookForm: FormGroup; // Formulario reactivo para la creación/edición de libros
  existingTitles: string[] = []; // Lista de títulos existentes para la validación asíncrona
  esEdicion: boolean = false; // Variable para determinar si es edición o creación de un libro
  currentYear: number = new Date().getFullYear(); // Obtiene el año actual para la validación del año de publicación
  enviado: boolean = false; // Variable para indicar si el formulario ha sido enviado
  oldUrl: string = ''; // Almacena la URL de la imagen anterior para eliminarla si se actualiza

  selectedFile!:File;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.bookForm = this.fb.group({
      id: [''], // Inicializa el ID como una cadena vacía, se llenará al editar un libro
      title: ['', {
        validators: [Validators.required],
        asyncValidators: [titleExistsValidator(this.existingTitles)], // Validador asíncrono para verificar si el título ya existe
      }],
      author: ['', Validators.required],
      year: ['', [Validators.required, Validators.pattern('^[0-9]{4}$'), yearValidator]],  // Validador personalizado para el año
      publishDate: [null, Validators.required] // Inicializa la fecha de publicación como null
    }, {updateOn: 'change'}); // Actualiza el formulario solo al enviar, no al cambiar los valores de los campos
  }

  async ngOnInit() {
    const books = await firstValueFrom(this.bookService.getBooks()); // Obtiene la lista de libros desde el servicio
    this.existingTitles = books.map(book => book.title); // Mapea los títulos de los libros existentes para usarlos en la validación asíncrona

    const params = await firstValueFrom(this.route.paramMap);
    const id = params.get('id'); // Obtiene el ID del libro desde los parámetros de la ruta

    if (id) { // Si hay un ID, significa que estamos en modo edición
      this.esEdicion = true; // Cambia a modo edición
      const book = await this.bookService.getBookById(id); // Obtiene el libro por ID
      if (book) {
        this.oldUrl = book.imageUrl!; // Guarda la URL de la imagen anterior para eliminarla si se actualiza
        this.bookForm.patchValue(book); // Rellena el formulario con los datos del libro
        this.imagePreview = book.imageUrl!; // Establece la vista previa de la imagen si existe
        this.existingTitles = this.existingTitles.filter(title => title !== book.title); // Elimina el título del libro actual de los títulos existentes para evitar conflictos en la validación
      }
    }
    this.bookForm.get('title')?.setAsyncValidators(titleExistsValidator(this.existingTitles)); // Establece el validador asíncrono para el título al cargar los títulos existentes
  }

  async guardar() {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched(); // Marca todos los campos como tocados para mostrar errores
      return; // No envía el formulario si es inválido
    }
    const book = this.bookForm.value // Obtiene los valores del formulario
    if (this.esEdicion)
      await this.bookService.updateBook(book.id, book, this.selectedFile, this.oldUrl) // Si es edición, actualiza el libro
    else
      await this.bookService.addBook(book, this.selectedFile);

    this.bookForm.reset();
    this.selectedFile = undefined!;
    this.enviado = true; // Marca el formulario como enviado
    this.router.navigate(['/catalogo']); // Redirige a la lista de libros después de guardar
  }
//
  onFileSelected(event: any){
    this.selectedFile = event.target.files[0];
    if (this.selectedFile){
      const reader = new FileReader();
      reader.onload = e => this.imagePreview = reader.result;
      reader.readAsDataURL(this.selectedFile); // Lee el archivo seleccionado como un ArrayBuffer para la vista previa
      
    } 

  }

  cancelar() {
    this.router.navigate(['/catalogo']); // Redirige a la lista de libros sin guardar cambios
  }
}
