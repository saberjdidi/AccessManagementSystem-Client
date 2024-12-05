import { Component, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Customer } from '../../interfaces/customer';
import { CustomerService } from '../../services/customer.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, RouterLink],
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.css'
})
export class AddCustomerComponent implements OnInit {

  _response: any;
  title = 'Add Customer';
  editcode = '';
  isedit = false;
  editdata!: Customer;
  snackBar = inject(MatSnackBar);

  constructor(private builder: FormBuilder, private router: Router,
    private service: CustomerService, private activeRoute: ActivatedRoute) {

  }

  ngOnInit(): void {

    this.editcode = this.activeRoute.snapshot.paramMap.get('code') as string;
    if (this.editcode != '' && this.editcode != null) {
      this.isedit = true
      this.title = 'Edit Customer';
      this.customerform.controls['code'].disable();
      this.service.getByCode(this.editcode).subscribe(item => {
        this.editdata = item;
        this.customerform.setValue({
          code: this.editdata.code, 
          name: this.editdata.name, 
          email: this.editdata.email,
          phone: this.editdata.phone, 
          creditlimit: this.editdata.creditlimit, 
          status: this.editdata.isActive
        })
      })
    }
  }

  customerform = this.builder.group({
    code: this.builder.control('', Validators.required),
    name: this.builder.control('', Validators.required),
    email: this.builder.control('', Validators.required),
    phone: this.builder.control('', Validators.required),
    creditlimit: this.builder.control(0, Validators.required),
    status: this.builder.control(true)
  })

  saveCustomer() {
    if (this.customerform.valid) {

      let _obj: Customer = {
        code: this.customerform.value.code as string,
        name: this.customerform.value.name as string,
        email: this.customerform.value.email as string,
        phone: this.customerform.value.phone as string,
        creditlimit: this.customerform.value.creditlimit as number,
        isActive: this.customerform.value.status as boolean,
        statusname: ''
      }

      if (!this.isedit) {
        this.service.createCustomer(_obj).subscribe(item => {
          this._response = item;
          if (this._response.result === 'pass') {
            this.snackBar.open('Created successfully', 'Ok', {
              duration: 3000,
              horizontalPosition: 'center',
            });
            this.router.navigateByUrl('/customer');
          } else {
            this.snackBar.open('Due to:' + this._response.message, 'Ok', {
              duration: 3000,
              horizontalPosition: 'center',
            });
          }
        })
      }else{
        _obj.code=this.editcode;
        this.service.updateCustomer(_obj).subscribe(item => {
          this._response = item;
          if (this._response.result === 'pass') {
            this.snackBar.open('Updated successfully', 'Ok', {
              duration: 3000,
              horizontalPosition: 'center',
            });
            this.router.navigateByUrl('/customer');
          } else {
            this.snackBar.open('Due to:' + this._response.message, 'Ok', {
              duration: 3000,
              horizontalPosition: 'center',
            });
          }
        })
      }


    }
  }
}
