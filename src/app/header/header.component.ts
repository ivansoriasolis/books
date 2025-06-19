import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() title: string = "título";

  constructor(public authService: AuthService,
    private router: Router,
  ) { }

  onLogout() {
    try {
      this.authService.logout();
      this.router.navigate(['/login']); // Redirigir al usuario a la página de login
      // Aquí podrías agregar lógica adicional antes de cerrar sesión, si es necesario  
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}