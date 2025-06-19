import { CommonModule, DatePipe, NgIf, UpperCasePipe } from '@angular/common';
import { Component, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../services/book.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-book-detail',
  imports: [DatePipe, UpperCasePipe, CommonModule],
  templateUrl: './book-detail.component.html',
  styleUrl: './book-detail.component.css'
})
export class BookDetailComponent {
  book: any;
  enviado: boolean = false;

  constructor(private route: ActivatedRoute, 
    public authService:AuthService,
    private bookService: BookService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.bookService.getBookById(id!).then((book) => {
        this.book = book;
      });
    });
  }

  editar(id: string){
    this.router.navigate(['/book-form-reactive', id]);
    }

  async eliminar(id: string) {
    await this.bookService.deleteBook(id);
    this.router.navigate(['/catalogo']);
  }
}