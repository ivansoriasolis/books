import { ResolveFn } from '@angular/router';
import { BookService } from '../services/book.service';
import { inject } from '@angular/core';
import { Book } from '../models/book';

export const bookResolver: ResolveFn<Book|undefined> = (route, state) => {
  const bookService = inject(BookService);
  const id = route.paramMap.get('id')!;
  return bookService.getBookById(id);
};
