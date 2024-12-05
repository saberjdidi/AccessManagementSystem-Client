import { Component, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Role } from '../../interfaces/role';
import { Menus } from '../../interfaces/menu';
import { MenuPermission } from '../../interfaces/menu-permission';
import { RoleService } from '../../services/role.service';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-role-assign',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './user-role-assign.component.html',
  styleUrl: './user-role-assign.component.css'
})
export class UserRoleAssignComponent implements OnInit {

  rolelist!: Role[];
  menulist!: Menus[];
  accessarray!: FormArray<any>;
  useraccess!: MenuPermission
  _response:any;
  authService = inject(AuthService);
  snackBar = inject(MatSnackBar);

  constructor(private builder: FormBuilder, private service: RoleService) {

  }
  ngOnInit(): void {
    this.loadroles();
    this.loadmenus('');
  }

  roleform = this.builder.group({
    userrole: this.builder.control('', Validators.required),
    access: this.builder.array([])
  })

  Generatemenurow(input: Menus, _access: MenuPermission, role:string) {
    return this.builder.group({
      menucode: this.builder.control(input.code),
      haveview: this.builder.control(_access.haveview),
      haveadd: this.builder.control(_access.haveadd),
      haveedit: this.builder.control(_access.haveedit),
      havedelete: this.builder.control(_access.havedelete),
      userrole:this.builder.control(role)
    })
  }

  Addnewrow(input: Menus, _access: MenuPermission, role:string) {
    this.accessarray.push(this.Generatemenurow(input, _access, role))
  }

  get getrows() {
    return this.roleform.get('access') as FormArray;
  }

  loadroles() {
    this.service.getRoles().subscribe(item => {
      this.rolelist = item;
    })
  }

  loadmenus(userrole: string) {
    this.accessarray = this.roleform.get('access') as FormArray;
    this.accessarray.clear();
    this.service.Getallmenus().subscribe(item => {
      this.menulist = item;
      if (this.menulist.length > 0) {

        this.menulist.map((o: Menus) => {

          if (userrole != '') {
            this.service.getMenuPermission(userrole, o.code).subscribe(item => {
              this.useraccess = item;
              this.Addnewrow(o, this.useraccess,userrole);
            })
          } else {
            this.Addnewrow(o, {
              code: '',
              name: '',
              haveview: false,
              haveadd: false,
              haveedit: false,
              havedelete: false,
              userrole: '',
              menucode: ''
            },'');
          }



        })
      }
    })
  }

  rolechange(event: any) {
    let selectedrole = event.value;
    this.loadmenus(selectedrole)

  }

  Saveroles() {

    if(this.roleform.valid){
      let formarry=this.roleform.value.access as MenuPermission[]
      this.service.assignRolePermission(formarry).subscribe(item=>{
        this._response=item;
        if (this._response.result == 'pass') {
          this.snackBar.open('Permission assigned successfully', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
          });
          //this.toastr.success('Permission assigned successfully', 'Saved');
        } else {
          this.snackBar.open('Failed due to : ' + this._response.message, 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
          });
          //this.toastr.error('Failed due to : ' + this._response.message, 'Menu access assignment')
        }
      })
    }

  }

}
