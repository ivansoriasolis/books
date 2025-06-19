import { Component, ViewChild } from '@angular/core';
import { BookListComponent } from '../book-list/book-list.component';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-catalogo',
  imports: [BookListComponent, RouterOutlet, FormsModule],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css'
})
export class CatalogoComponent {

  selectedBook: any = null;
  selectedTitle: string = "";
  searchText: string = '';

}
