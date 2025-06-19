import { Injectable } from '@angular/core';
import { Auth, authState, GoogleAuthProvider, signInWithPopup, signOut, user } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, User } from 'firebase/auth';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authState$: Observable<User | null> = new Observable<User | null>; // Observable que emite el estado de autenticación del usuario

  constructor(private auth: Auth, private router: Router) {
    this.authState$ = authState(this.auth); // Inicializar el observable de estado de autenticación
  }

  // Método para registrar un nuevo usuario con email y contraseña
  async register(email: string, password: string): Promise<void> {
    await createUserWithEmailAndPassword(this.auth, email, password); // Crear un nuevo usuario con email y contraseña
  }

  // Método para iniciar sesión con email y contraseña
  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password); // Iniciar sesión con email y contraseña
  }

  // Método para iniciar sesión con Google
  async loginWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider(); // Crear un proveedor de autenticación de Google
    await signInWithPopup(this.auth, provider); // Iniciar sesión con Google usando un popup
  }

  // Método para cerrar sesión
  async logout(): Promise<void> {
      await signOut(this.auth); // Cerrar sesión del usuario
  }

  // Método para verificar si el usuario está logueado
  estaAutenticado():Observable<boolean> {
    return this.authState$.pipe(map(user => !!user)); // Retorna un observable que emite true si el usuario está autenticado, false en caso contrario
  }

}
