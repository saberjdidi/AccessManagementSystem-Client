import { Component, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoleService } from '../../services/role.service';
import { Observable } from 'rxjs';
import { Role } from '../../interfaces/role';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RegisterRequest } from '../../interfaces/register-request';
import { HttpErrorResponse } from '@angular/common/http';
import { ValidationError } from '../../interfaces/validation-error';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, RouterLink, AsyncPipe, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  hidePassword: boolean = true;
  registerForm! : FormGroup;
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  roleService = inject(RoleService);
  router = inject(Router);
  matSnackBar = inject(MatSnackBar);
  roles$!: Observable<Role[]>;
  errors!: ValidationError[];

  ngOnInit(): void {
    /*
    this.registerForm = this.fb.group(
      {
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      roles: [''],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    },
    {
      Validator: this.passwordMatchValidator
    }
  );
    */


  this.registerForm = this.fb.group(
    {
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      roles: [''],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    },
    {
      validators: this.passwordMatchValidator // Correct key
    }
  );

    this.roles$ = this.roleService.getRoles();
  }

  registerFn(){
    if (this.registerForm.valid) {
      let _obj: RegisterRequest = {
        fullName: this.registerForm.value.fullName as string,
        email: this.registerForm.value.email as string,
        password: this.registerForm.value.password as string,
        roles: this.registerForm.value.roles as string
      }

     this.authService.registerService(_obj).subscribe({
      next: (response) => {
        this.matSnackBar.open(response.message, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
        });
        this.router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => {
        if(err!.status === 400){
          this.errors = err!.error;
          this.matSnackBar.open('Validations error', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
          });
        }
        else {
          this.errors = err!.error;
          this.matSnackBar.open(err.error.message, 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
          });
          console.log(`Error login : ${err.error.message}`)
        }
      },
      complete: () => console.log('Register success!')
     });

    }
  }

  private passwordMatchValidator(control: AbstractControl) : { [key: string]: boolean } | null {

    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if(password != confirmPassword){
      return { passwordMismatch: true };
    }

    return null;
  }
}
