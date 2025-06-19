import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;
  errorMessage: string = ''; // Mensaje de error para mostrar al usuario

  constructor(public authService:AuthService, 
    private fb: FormBuilder,
    private router: Router,
  ) { 
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.authService.authState$.subscribe(user => {
      if (user) {
        this.router.navigate(['/catalogo']); // Redirigir al catálogo si el usuario está autenticado
      }
    });
  }

  async onLogin() { 
    if (this.loginForm.invalid)
      return;
    const { email, password } = this.loginForm.value;
    try {
      await this.authService.login(email, password); // Llama al servicio de autenticación para iniciar sesión
      this.router.navigate(['/catalogo']); // Redirigir al catálogo después del login exitoso
    } catch (error) {
      this.errorMessage = "Error al iniciar sesión. Por favor, verifica tus credenciales.";
    }
  }

  async onLoginWithGoogle() {
    try {
      await this.authService.loginWithGoogle(); // Llama al servicio de autenticación para iniciar sesión con Google
      this.router.navigate(['/catalogo']); // Redirigir al catálogo después del login exitoso
    } catch (error) {
      this.errorMessage = "Error al iniciar sesión con Google. Por favor, intenta nuevamente.";
    }
  }

}
