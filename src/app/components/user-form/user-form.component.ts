import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MicroService } from '../../services/micro/micro.service';
import { User } from '../../interfaces/user';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatInputModule, MatSnackBarModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent {
  userForm: FormGroup;
  userId: number = 0;
  title: string = 'Crear nuevo usuario';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private microService: MicroService,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      edad: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.userId = +this.route.snapshot.paramMap.get('id')!;
    this.loadUser();
    this.title = this.userId === 0 ? 'Crear nuevo usuario' : 'Editar usuario';
  }

  // Traer usuario por su id
  loadUser(): void {
    this.microService.getUserById(this.userId).subscribe((user: User) => {
      this.userForm.patchValue({
        nombre: user.nombre,
        correo: user.correo,
        edad: user.edad
      });
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      if (this.userId) {
        // Editar usuario
        this.microService.updateUser(this.userId, this.userForm.value).subscribe({
          next: () => {
            this.snackBar.open('Usuario actualizado con éxito', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/']);
          },
          error: (error) => {
            const errorMessage = error.error?.message || 'Error al editar el usuario';
            this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
          }
        });
      } else {
        // Crear nuevo usuario
        this.microService.addUser(this.userForm.value).subscribe({
          next: () => {
            this.snackBar.open('Usuario creado con éxito', 'Cerrar', { duration: 3000 });
            this.router.navigate(['/']);
          },
          error: (error) => {
            const errorMessage = error.error?.message || 'Error al crear el usuario';
            this.snackBar.open(errorMessage, 'Cerrar', { duration: 3000 });
          }
        });
      }
    }
  }


  cancel(): void {
    this.router.navigate(['/'])
  }

}
