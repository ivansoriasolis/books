import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export function titleExistsValidator(existingTitles: string[]) {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return of(existingTitles.includes(control.value)).pipe(
      delay(500),
      map(exists => (exists ? { titleTaken: true } : null))
    );
  };
}