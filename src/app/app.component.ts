import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'catalogo-libros';
  authChecked = false; // Variable para verificar si la autenticación ha sido comprobada

  constructor(private authService: AuthService,
    private router: Router,
  ) {
    // Aquí podrías inicializar algo si es necesario
  }

  ngOnInit():void {
    this.authService.authState$.subscribe(user => {
      this.authChecked = true; // Marcar que la autenticación ha sido comprobada
      if(user){
        this.router.navigate(['/catalogo']); // Redirigir al catálogo si el usuario está autenticado
      }
      else {
        this.router.navigate(['/home']); // Redirigir al login si el usuario no está autenticado
      }
    });
  }

}
