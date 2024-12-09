import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsyncPipe, formatDate } from '@angular/common';
import { Product } from '../../../interfaces/product';
import { HttpErrorResponse } from '@angular/common/http';
import { CategoryService } from '../../../services/category.service';
import { MaterialModule } from '../../../material.module';
import { Category } from '../../../interfaces/category';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, RouterLink, AsyncPipe],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent {
  title = 'Add Product';
  snackBar = inject(MatSnackBar);
  categoryService = inject(CategoryService);
  selectedFile: File | null = null;
  categories$ = this.categoryService.getAllCategories();

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
   /* if (id) {
      this.title = 'Edit Category';
      this.productService.getProductById(id).subscribe((product) => {
        this.productForm.patchValue(product);
      });
    } */
  }

  productForm = this.fb.group({
    id: [0],
    name: this.fb.control('', Validators.required),
    description: this.fb.control('', Validators.required),
    price: this.fb.control('', Validators.required),
    categoryId: this.fb.control('', Validators.required),
  });
  

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmitFn(): void {
    if (this.productForm.invalid || !this.selectedFile) {
      alert('Please fill all fields and select a file.');
      return;
    }

    if (this.productForm.valid) {
      let currentDate = new Date();
      const creatAt = formatDate(currentDate, 'yyyy-MM-ddTHH:mm:ss', 'en-US');
  
  
      if (this.productForm.value.id) {
      /*  this.productService.updateProduct(objCategory, this.productForm.value.id).subscribe({
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
         }); */
      } else {

        const formData = new FormData();
              formData.append('Name', this.productForm.value.name as string);
              formData.append('Description', this.productForm.value.description as string);
              formData.append('Price', this.productForm.value.price as string);
              formData.append('CategoryId', this.productForm.value.categoryId as string);
              formData.append('File', this.selectedFile);

        this.productService.addProduct(formData).subscribe({
          next: data => {
            this.snackBar.open('Product added successfully', 'Ok', {
              duration: 3000,
              horizontalPosition: 'center',
            });
            this.router.navigate(['/product']);
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
}
