import { Component, inject, Inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserDetail } from '../../interfaces/user-detail';
import { Role } from '../../interfaces/role';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { RoleService } from '../../services/role.service';
import { UpdateUser } from '../../interfaces/update-user';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, FormsModule],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent implements OnInit {

  dialogdata: any;
  userdata!: UserDetail;
  rolelist!: Role[]
  type = '';
  _response: any;
  responseUserDetails:any;
  snackBar = inject(MatSnackBar);

  constructor(private builder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any,
    private service: AuthService, private roleService: RoleService, private ref: MatDialogRef<UpdateUserComponent>) {

  }

  ngOnInit(): void {
    this.loadRoles();
    this.dialogdata = this.data;
    this.type = this.dialogdata.type;
    console.log(this.dialogdata);
    if (this.dialogdata.email !== '') {

      this.service.getUserByEmail(this.dialogdata.email).subscribe(item => {
       this.responseUserDetails = item;

        console.log(`userdata => roles: ${this.responseUserDetails.result.roles}`);

      /*  this.userform.setValue({ 
          email: this.responseUserDetails.result.email, 
          roles: this.responseUserDetails.result.roles, 
          status: this.responseUserDetails.result.lockoutEnabled 
        }) */

        const rolesArray = this.builder.array(
          this.responseUserDetails.result.roles.map((role: string) =>
            this.builder.control(role)
          )
        );
    
        this.userform.setControl('roles', rolesArray);
    
        this.userform.patchValue({
          email: this.responseUserDetails.result.email,
          status: this.responseUserDetails.result.lockoutEnabled,
        });

      });
     
    }
  }

  loadRoles() {
    this.roleService.getRoles().subscribe(item => {
      this.rolelist = item;
    })
  }

  userform = this.builder.group({
    email: this.builder.control({ value: '', disabled: true }),
    roles: this.builder.array([], Validators.required), // Use FormArray for multiple roles
    //roles: this.builder.array([]),
    //role: this.builder.control('', Validators.required),
    status: this.builder.control(true)
  })

  proceedchange() {
    if (this.userform.valid) {
      console.log(`roles : ${this.userform.value.roles}`);
      let _obj: UpdateUser = {
        email: this.dialogdata.email,
        roles: this.userform.value.roles as string[],
        status:this.userform.value.status as boolean
      }

      if (this.type === 'role') {
        this.service.updateRole(_obj).subscribe(item => {
          this._response=item;
          if (this._response.result == 'pass') {
            this.snackBar.open('Role Updated successfully', 'Ok', {
              duration: 3000,
              horizontalPosition: 'center',
            });
            //this.toastr.success('Updated successfully', 'Role Update');
            this.closepopup();
          } else {
              this.snackBar.open('Failed due to : ' + this._response.message, 'Ok', {
                duration: 3000,
                horizontalPosition: 'center',
              });
            //this.toastr.error('Failed due to : ' + this._response.message, 'Role Update')
        }
        })
      } else {
        this.service.Updatestatus(_obj).subscribe(item => {
          this._response=item;
          if (this._response.result == 'pass') {
            this.snackBar.open('Status Updated successfully', 'Ok', {
              duration: 3000,
              horizontalPosition: 'center',
            });
            this.closepopup();
          } else {
            this.snackBar.open('Failed due to : ' + this._response.message, 'Ok', {
              duration: 3000,
              horizontalPosition: 'center',
            });
          }
        })
      }
    }
  }

  closepopup() {
    this.ref.close();
  }
}
