import { Component, inject } from '@angular/core';
import { RoleFormComponent } from '../../components/role-form/role-form.component';
import { RoleService } from '../../services/role.service';
import { RoleCreateRequest } from '../../interfaces/role-create-request';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
import { RoleListComponent } from '../../components/role-list/role-list.component';
import { AuthService } from '../../services/auth.service';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [RoleFormComponent, RoleListComponent, MaterialModule, AsyncPipe],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent {

  roleService = inject(RoleService);
  authService = inject(AuthService);
  errorMessage = '';
  role: RoleCreateRequest = {} as RoleCreateRequest;
  snackBar = inject(MatSnackBar);
  roles$ = this.roleService.getRoles();
  users$ = this.authService.getAllUsers();
  selectedUser: string = '';
  selectedRole: string = '';

  createRole(role: RoleCreateRequest){
    this.roleService.createRole(role).subscribe({
      next: (response : {message: string}) => {
        this.snackBar.open('Role created successfully', 'Ok', {
          duration: 3000,
          horizontalPosition: 'center',
        });
      },
      error: (error: HttpErrorResponse) => {
        if(error.status === 400){
          this.errorMessage = error.error;
        }

        this.snackBar.open(error.error.message, 'Ok', {
          duration: 5000,
          horizontalPosition: 'center',
        });
        this.errorMessage = error.error;
        console.log(`Error : ${error.error.message}`)
      }
     });
  }

  deleteRole(id: string){
    this.roleService.deleteRole(id).subscribe({
      next: (response : {message: string}) => {
        this.roles$ = this.roleService.getRoles();
        this.snackBar.open('Role deleted successfully', 'Ok', {
          duration: 3000,
          horizontalPosition: 'center',
        });
      },
      error: (error: HttpErrorResponse) => {

        this.snackBar.open(error.error.message, 'Ok', {
          duration: 5000,
          horizontalPosition: 'center',
        });
        //this.errorMessage = error.error;
        console.log(`Error : ${error.error.message}`)
      }
     });
  }

  assignRole(){
    this.roleService.assignRole(this.selectedUser, this.selectedRole).subscribe({
      next: (response : {message: string}) => {
        this.roles$ = this.roleService.getRoles();
        this.snackBar.open('Role deleted successfully', 'Ok', {
          duration: 3000,
          horizontalPosition: 'center',
        });
      },
      error: (error: HttpErrorResponse) => {

        this.snackBar.open(error.error.message, 'Ok', {
          duration: 5000,
          horizontalPosition: 'center',
        });
        //this.errorMessage = error.error;
        console.log(`Error : ${error.error.message}`)
      }
     });
  }
}
