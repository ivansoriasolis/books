import { AbstractControl, ValidationErrors } from '@angular/forms';

export function yearValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (value && (+value < 1 || +value > new Date().getFullYear())) {
    return { invalidYear: true };
  }
  return null;
}

export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  if (password !== confirmPassword) {
    return { passwordsDoNotMatch: true };
  }
  return null;
}