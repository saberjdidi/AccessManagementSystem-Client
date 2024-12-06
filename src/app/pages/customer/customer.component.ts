import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { Router, RouterLink } from '@angular/router';
import { Customer } from '../../interfaces/customer';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CustomerService } from '../../services/customer.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MenuPermission } from '../../interfaces/menu-permission';
import { RoleService } from '../../services/role.service';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [MaterialModule, RouterLink],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent implements OnInit {
  customerlist!: Customer[];
  displayedColumns: string[] = ["code", "name", "email", "phone", "creditlimit", "status", "action"];
  datasource: any;
  _response:any;
  snackBar = inject(MatSnackBar);
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private service: CustomerService, private roleService: RoleService, private authService: AuthService, private router: Router) {

  }
  ngOnInit(): void {
    this.setAccess();
    this.Loadcustomer();
  }

  setAccess() {

    //let role = localStorage.getItem('userrole') as string;
    let userDetail = this.authService.getUserDetail();
    let roles = userDetail?.roles;
    this.roleService.getMenuPermission(roles, 'customer').subscribe(data => {

      this._permission = data;
      console.log(this._permission);
    })
  }

  Loadcustomer() {
    this.service.getAll().subscribe({
      next: data => {
        this.customerlist = data;
      this.datasource = new MatTableDataSource<Customer>(this.customerlist);
      this.datasource.paginator = this.paginator;
      this.datasource.sort = this.sort;
      },
      error: (error: HttpErrorResponse) => {

        this.snackBar.open(error.error.message, 'Ok', {
          duration: 5000,
          horizontalPosition: 'center',
        });
        //this.errorMessage = error.error;
        console.log(`Error : ${error.error.message}`)
      }
     })
  }

  editFn(code: string) {
   // this.router.navigateByUrl('/customer/edit/' + code)
    if (this._permission.haveedit) {
      this.router.navigateByUrl('/customer/edit/' + code)
    } else {
      this.snackBar.open('User not having edit access', 'Ok', {
        duration: 3000,
        horizontalPosition: 'center',
      });
      //this.toastr.warning('User not having edit access', 'warning')
    } 
  }

  deleteFn(code: string) {
    
    if (this._permission.havedelete) {
      if (confirm('Are you sure?')) {
        this.service.deleteCustomer(code).subscribe(item=>{
          this._response=item;
          if (this._response.result === 'pass') {
            this.snackBar.open('Deleted successfully', 'Ok', {
              duration: 3000,
              horizontalPosition: 'center',
            });
            //this.toastr.success('Deleted successfully', 'Success');
            this.Loadcustomer();
          } else {
            this.snackBar.open('Due to:' + this._response.message, 'Ok', {
              duration: 3000,
              horizontalPosition: 'center',
            });
            //this.toastr.error('Due to:' + this._response.message, 'Failed');
          }
        })
      }
    } else {
      this.snackBar.open('User not having delete access', 'Ok', {
        duration: 3000,
        horizontalPosition: 'center',
      });
      //this.toastr.warning('User not having delete access', 'warning')
    } 
  }
}
