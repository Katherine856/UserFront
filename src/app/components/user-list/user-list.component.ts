import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user';
import { UserCardComponent } from '../user-card/user-card.component';
import { MicroService } from '../../services/micro/micro.service';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, UserCardComponent, MatSnackBarModule, MatButtonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {

  users: User[] = [];
  message: string = '';

  constructor(private microService: MicroService, private router: Router, private snackBar: MatSnackBar){}

  ngOnInit() {
    this.getUsers();
  }

  getUsers(): void {
    this.microService.getData().subscribe(
      (data: User[] | any) => {
        if (data.message) {
          this.message = data.message; // Muestra el mensaje si no se encontraron usuarios
        } else {
          this.users = data; // Asigna los datos recibidos al array de usuarios
        }
      },
      (error) => {
        const errorMessage = error.error?.message || 'Error al eliminar el usuario';
            this.snackBar.open(errorMessage, 'Cerrar', {
            duration: 3000
          });
      }
    );
  }

  // Evento enviado desde UserCardComponent
  onUserDeleted(): void {
    this.getUsers(); 
  }

  addUser(): void {
    this.router.navigate(['/user-form']); // Redirige para agregar un nuevo usuario
  }
}
