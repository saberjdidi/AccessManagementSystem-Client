import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AsyncPipe } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserDetail } from '../../interfaces/user-detail';
import { MatTableDataSource } from '@angular/material/table';
import { UpdateUserComponent } from '../update-user/update-user.component';
import { MenuPermission } from '../../interfaces/menu-permission';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [AsyncPipe, MaterialModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  authService = inject(AuthService);
  roleService = inject(RoleService);
  user$ = this.authService.getAllUsers();

  userlist!: UserDetail[];
  displayedColumns: string[] = ["fullName", "email", "phoneNumber", "role", "status", "action"];
  datasource: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  _permission: MenuPermission = {
    code: '',
    name: '',
    haveview: false,
    haveadd: false,
    haveedit: false,
    havedelete: false,
    userrole: '',
    menucode: ''
  }

  constructor(private dialog: MatDialog) {

  }
  ngOnInit(): void {
    this.setAccess();
    this.Loadusers();
  }

  setAccess() {

    //let role = localStorage.getItem('userrole') as string;
    let userDetail = this.authService.getUserDetail();
    let roles = userDetail?.roles;
    this.roleService.getMenuPermission(roles, 'user').subscribe(item => {

      this._permission = item;
      console.log(this._permission);
    })
  }

  Loadusers() {
    this.authService.getAllUsers().subscribe(item => {
      this.userlist = item;
      this.datasource = new MatTableDataSource<UserDetail>(this.userlist);
      this.datasource.paginator = this.paginator;
      this.datasource.sort = this.sort;
    })
  }

  updaterole(code: string) {
    this.Openpopup(code,'role');
  }

  updatestatus(code: string) {
    this.Openpopup(code,'status');
  }

  Openpopup(email: string, type: string) {
    this.dialog.open(UpdateUserComponent, {
      width: '30%',
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '1000ms',
      data: {
        email: email,
        type: type
      }
    }).afterClosed().subscribe(item=>{
      this.Loadusers();
    })
  }
}
