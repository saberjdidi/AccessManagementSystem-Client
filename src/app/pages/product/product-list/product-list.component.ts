import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../../interfaces/product';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MenuPermission } from '../../../interfaces/menu-permission';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RoleService } from '../../../services/role.service';
import { AuthService } from '../../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../../../services/product.service';
import { MatTableDataSource } from '@angular/material/table';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductDeleteComponent } from '../product-delete/product-delete.component';
import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [MaterialModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  listProducts: Product[] = [];
  displayedColumns: string[] = ["image", "name", "description", "price", "category", "action"];
  datasource: any;
  _response:any;
  router = inject(Router);
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

  constructor(private productService: ProductService, private roleService: RoleService, private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.setAccess();
    this.fetchData();
  }

  setAccess() {

    let userDetail = this.authService.getUserDetail();
    let roles = userDetail?.roles;
    this.roleService.getMenuPermission(roles, 'product').subscribe(data => {

      this._permission = data;
      console.log(this._permission);
    })
  }

  fetchData(): void {
    this.productService.getAllProducts().subscribe({
      next: data => {
        this.listProducts = data;
        this.datasource = new MatTableDataSource<Product>(this.listProducts);
        this.datasource.paginator = this.paginator;
        this.datasource.sort = this.sort;
      },
      error: (error: HttpErrorResponse) => {

        this.snackBar.open(error.error.message, 'Ok', {
          duration: 3000,
          horizontalPosition: 'center',
        });
        //this.errorMessage = error.error;
        console.log(`Error : ${error.error.message}`)
      }
     })
  }

  editFn(id: string) {
    console.log('id product : ' + id);
    if (this._permission.haveedit) {
      this.router.navigateByUrl('/product/edit/' + id)
    } else {
      this.snackBar.open('User not having edit access', 'Ok', {
        duration: 3000,
        horizontalPosition: 'center',
      });
      //this.toastr.warning('User not having edit access', 'warning')
    } 
   }

  deleteFn(id: number) {
    this.Openpopup(id);
  }

  Openpopup(id: number) {
    this.dialog.open(ProductDeleteComponent, {
      width: '30%',
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '1000ms',
      data: {
        id: id
      }
    }).afterClosed().subscribe(item=>{
      this.fetchData();
    })
  }
}
