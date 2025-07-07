import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../validators/custom-validator';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm: FormGroup;

  constructor( private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router) { 
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, {
      validators: passwordMatchValidator
    });
  }

  async register() { 
    if (this.registerForm.invalid) {
      return;
    }
    const { email, password } = this.registerForm.value;
    // Aquí puedes llamar al servicio de registro
    try {
      await this.authService.register(email, password);
      this.router.navigate(['/catalogo']); // Redirigir al catálogo después del registro exitoso   
    } catch (error) {
      console.error('Error al registrar:', error);
    };
  }
}
