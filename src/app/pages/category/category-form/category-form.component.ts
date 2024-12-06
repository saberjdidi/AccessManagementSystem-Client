import { Component, inject } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { Category } from '../../../interfaces/category';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, RouterLink],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css'
})
export class CategoryFormComponent {

  categoryForm: FormGroup;
  title = 'Add Category';
  snackBar = inject(MatSnackBar);

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.categoryForm = this.fb.group({
      id: [0],
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.title = 'Edit Category';
      this.categoryService.getCategoryById(id).subscribe((category) => {
        this.categoryForm.patchValue(category);
      });
    }
  }

  onSubmitFn(): void {

    let currentDate = new Date();
    const creatAt = formatDate(currentDate, 'yyyy-MM-ddTHH:mm:ss', 'en-US');

    let objCategory: Category = {
      id: this.categoryForm.value.id as number,
      name: this.categoryForm.value.name as string,
      createdAt: creatAt as string
    }

    if (this.categoryForm.value.id) {
      this.categoryService.updateCategory(objCategory).subscribe({
        next: data => {
          this.snackBar.open('Created successfully', 'Ok', {
            duration: 3000,
            horizontalPosition: 'center',
          });
          this.router.navigate(['/category']);
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
    } else {
      this.categoryService.addCategory(objCategory).subscribe({
        next: data => {
          this.snackBar.open('Updated successfully', 'Ok', {
            duration: 3000,
            horizontalPosition: 'center',
          });
          this.router.navigate(['/category']);
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
}
