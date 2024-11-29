import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [MaterialModule, FormsModule,RouterLink],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {

  email!: string;
  authService = inject(AuthService);
  snackBar = inject(MatSnackBar);
  showEmailSent = false;
  isSubmitting = false;

  forgetPasswordFn(){
    this.isSubmitting = true;
     this.authService.forgotPasswordService(this.email).subscribe({
      next: (response) => {
        if(response.isSuccess){
          this.snackBar.open(response.message, 'Close', {
            duration: 5000
          });
          this.showEmailSent = true;
          //this.router.navigate(['/']);
        } 
        else {
          this.snackBar.open(response.message, 'Close', {
            duration: 5000
          });
        }
        
      },
      error: (error) => {
        this.snackBar.open(error.message, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
        });
        console.log(`Error login : ${error.error.message}`)
      },
      complete: ()=> {
        this.isSubmitting = false;
      }
     });
  }

}
