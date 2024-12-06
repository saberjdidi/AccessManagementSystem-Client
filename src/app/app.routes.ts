import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { authGuard } from './guards/auth.guard';
import { UsersComponent } from './pages/users/users.component';
import { roleGuard } from './guards/role.guard';
import { RolesComponent } from './pages/roles/roles.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { AddCustomerComponent } from './pages/add-customer/add-customer.component';
import { UserRoleAssignComponent } from './pages/user-role-assign/user-role-assign.component';
import { CategoryListComponent } from './pages/category/category-list/category-list.component';
import { CategoryFormComponent } from './pages/category/category-form/category-form.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'forget-password', component: ForgetPasswordComponent},
    {path: 'reset-password', component: ResetPasswordComponent},
    {path: 'change-password', component: ChangePasswordComponent, canActivate: [authGuard]},
    {path: 'profile/:id', component: ProfileComponent, canActivate: [authGuard]},
    {path: 'customer', component: CustomerComponent, canActivate: [authGuard]},
    {path:'customer/add', component:AddCustomerComponent, canActivate:[authGuard]},
    {path:'customer/edit/:code',component:AddCustomerComponent, canActivate:[authGuard]},
    {path:'category',component:CategoryListComponent, canActivate:[authGuard]},
    { path: 'category/add', component: CategoryFormComponent, canActivate:[authGuard] },
    { path: 'category/edit/:id', component: CategoryFormComponent, canActivate:[authGuard] },
    {path: 'user',
     component: UsersComponent, 
     canActivate: [roleGuard],
    data:{
      roles: ['Admin']
    }
   },
   {path: 'role',
    component: RolesComponent, 
    canActivate: [roleGuard],
   data:{
     roles: ['Admin']
   }
  },
  {path: 'userroleassign',
   component: UserRoleAssignComponent, 
   canActivate: [roleGuard],
  data:{
    roles: ['Admin']
  }
 },
  { path: '**', redirectTo: 'login' }
];
