import { Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { authGuard } from './guards/auth.guard';
import { bookResolver } from './resolvers/book.resolver';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
    { path: 'contacto', loadComponent: () => import('./contact/contact.component').then(m => m.ContactComponent) },
    {
        path: 'catalogo',
        loadComponent: () => import('./catalogo/catalogo.component').then(m => m.CatalogoComponent),
        children: [
            {
                path: 'detalle/:id',
                loadComponent: () => import('./book-detail/book-detail.component').then(m => m.BookDetailComponent),
                resolve: { book: bookResolver },
            },
        ],
        // canActivate: [authGuard],
    },

    {
        path: 'login',
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
    },
    {
        path: 'register',
        loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent),
    },
    {
        path: 'book-form-reactive/:id',
        loadComponent: () => import('./book-form-reactive/book-form-reactive.component').then(m => m.BookFormReactiveComponent),
        canActivate: [authGuard],
    },
    {
        path: 'book-form-reactive',
        loadComponent: () => import('./book-form-reactive/book-form-reactive.component').then(m => m.BookFormReactiveComponent),
        canActivate: [authGuard],
    }
];
