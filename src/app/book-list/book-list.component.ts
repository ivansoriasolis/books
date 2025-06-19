import { CommonModule, UpperCasePipe } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { BookService } from '../services/book.service';
import { FormsModule } from '@angular/forms';
import { Book } from '../models/book';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, combineLatest, map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-book-list',
  imports: [CommonModule, UpperCasePipe, FormsModule, 
    RouterLink],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent {

  @Input() searchText: string = ''; // Variable para almacenar el texto de búsqueda

  books$: Observable<Book[]>;
  private searchTextSubject = new BehaviorSubject<string>('');
  searchText$ = this.searchTextSubject.asObservable();

  filteredBooks$!: Observable<Book[]>;


  constructor(private bookService: BookService,) {
    this.books$ = this.bookService.getBooks(); //
  }

  ngOnInit() {
    // Inicializar la lista de libros filtrados
    this.filteredBooks$ = combineLatest([ 
      this.books$,
      this.searchText$.pipe(startWith(''))
    ]).pipe(
      map(([books, searchText]) =>
        books.filter(book =>
          book.title.toLowerCase().includes(searchText.toLowerCase())
        )
      )
    );
  }

  // Método para manejar los cambios en las propiedades de entrada
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['searchText']){
      this.onSearchText(this.searchText); 
    }
  }

  onSearchText(value: string): void {
    this.searchTextSubject.next(value); // Actualizar el observable con el nuevo texto de búsqueda
  }

}
