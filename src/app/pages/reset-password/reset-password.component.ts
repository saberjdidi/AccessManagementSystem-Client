import { Component, inject, OnInit } from '@angular/core';
import { ResetPasswordRequest } from '../../interfaces/reset-password-request';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, MaterialModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {

  resetPassword = {} as ResetPasswordRequest; 
  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.resetPassword.email = params["email"];
      this.resetPassword.token = params["token"];
    })
  }

  resetPasswordFn(){
     this.authService.resetPasswordService(this.resetPassword).subscribe({
      next: (response) => {
        if(response.isSuccess){
          this.snackBar.open(response.message, 'Close', {
            duration: 5000
          });
          this.router.navigate(['/login']);
        } 
        else {
          this.snackBar.open(response.message, 'Close', {
            duration: 5000
          });
        }
        
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open(error.error.message, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
        });
        console.log(`Error login : ${error.error.message}`)
      }
     });
  }
}


//chaker ayedi 1411 ; 15/03/1973/ cha