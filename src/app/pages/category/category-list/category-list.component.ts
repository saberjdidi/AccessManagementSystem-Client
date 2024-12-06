import { Component, Inject, inject, OnInit, ViewChild } from '@angular/core';
import { Category } from '../../../interfaces/category';
import { CategoryService } from '../../../services/category.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MenuPermission } from '../../../interfaces/menu-permission';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RoleService } from '../../../services/role.service';
import { AuthService } from '../../../services/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { HttpErrorResponse } from '@angular/common/http';
import { MaterialModule } from '../../../material.module';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CategoryDeleteComponent } from '../category-delete/category-delete.component';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [MaterialModule, RouterLink],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  displayedColumns: string[] = ["id", "name", "action"];
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

  constructor(private categoryService: CategoryService, private roleService: RoleService, private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.setAccess();
    this.fetchCategories();
  }

  setAccess() {

    let userDetail = this.authService.getUserDetail();
    let roles = userDetail?.roles;
    this.roleService.getMenuPermission(roles, 'category').subscribe(data => {

      this._permission = data;
      console.log(this._permission);
    })
  }

  fetchCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: data => {
        this.categories = data;
        this.datasource = new MatTableDataSource<Category>(this.categories);
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
    console.log('id category : ' + id);
    if (this._permission.haveedit) {
      this.router.navigateByUrl('/category/edit/' + id)
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
    this.dialog.open(CategoryDeleteComponent, {
      width: '30%',
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '1000ms',
      data: {
        id: id
      }
    }).afterClosed().subscribe(item=>{
      this.fetchCategories();
    })
  }
}
