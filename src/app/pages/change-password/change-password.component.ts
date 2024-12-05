import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangePassword } from '../../interfaces/change-password';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [FormsModule, RouterModule, MaterialModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  currentPassword!: string;
  newPassword!: string;
  authService = inject(AuthService);
  snackBar = inject(MatSnackBar);
  router = inject(Router);

  changePasswordFn(){
    let _obj: ChangePassword = {
      email: this.authService.getUserDetail()?.email as string,
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    }

    this.authService.changePasswordService(_obj).subscribe({
      next: (response) => {
        if(response.isSuccess){
          this.snackBar.open(response.message, 'Close', {
            duration: 3000
          });
          this.authService.logout();
          this.router.navigate(['/login']);
        } 
        else {
          this.snackBar.open(response.message, 'Close', {
            duration: 3000
          });
        }
        
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open(error.error.message, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
        });
        console.log(`Error change password : ${error.error.message}`)
      }
     });
  }
  
}
