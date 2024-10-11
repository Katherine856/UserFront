import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MicroService } from '../../services/micro/micro.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatSnackBarModule, MatButtonModule],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss'
})
export class UserCardComponent {
  @Input() user!: User;
  @Output() userDeleted = new EventEmitter<void>(); // Evento para notificar la eliminación

  constructor(
    private router: Router, 
    private microService: MicroService, 
    private dialog: MatDialog, 
    private snackBar: MatSnackBar
    ) { }

  navigateToUserForm(userId: number): void {
    this.router.navigate(['/user-form', userId]);
  }

  deleteUser(userId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.microService.deleteUser(userId).subscribe(
          () => {
            this.snackBar.open('Usuario eliminado con éxito', 'Cerrar', {
              duration: 3000
            });
            this.userDeleted.emit(); // Emitir el evento de eliminación
          },
          (error) => {
            const errorMessage = error.error?.message || 'Error al eliminar el usuario';
            this.snackBar.open(errorMessage, 'Cerrar', {
            duration: 3000
          });
          }
        );
      }
    });
  }
}
