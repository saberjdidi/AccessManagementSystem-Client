import { Component, Inject, inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../../material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../../../services/category.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-category-delete',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './category-delete.component.html',
  styleUrl: './category-delete.component.css'
})
export class CategoryDeleteComponent implements OnInit {
  snackBar = inject(MatSnackBar);
  dialogdata: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private categoryService: CategoryService, private ref: MatDialogRef<CategoryDeleteComponent>) {

  }
  ngOnInit(): void {
    this.dialogdata = this.data;
  }

  
  deleteFn(): void {
        this.categoryService.deleteCategory(this.dialogdata.id).subscribe({
          next: data => {
            this.snackBar.open('Category Deleted Successfully', 'Ok', {
              duration: 3000,
              horizontalPosition: 'center',
            });
            this.closePopup();
          },
          error: (error: HttpErrorResponse) => {
    
            this.snackBar.open(error.error.message, 'Ok', {
              duration: 3000,
              horizontalPosition: 'center',
            });
            //this.errorMessage = error.error;
            console.log(`Error : ${error.error.message}`)
          }
         });
  }

  closePopup() {
    this.ref.close();
  }
}
