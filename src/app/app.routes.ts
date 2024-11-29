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

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'forget-password', component: ForgetPasswordComponent},
    {path: 'reset-password', component: ResetPasswordComponent},
    {path: 'profile/:id', component: ProfileComponent, canActivate: [authGuard]},
    {path: 'users',
     component: UsersComponent, 
     canActivate: [roleGuard],
    data:{
      roles: ['Admin']
    }
   },
   {path: 'roles',
    component: RolesComponent, 
    canActivate: [roleGuard],
   data:{
     roles: ['Admin']
   }
  },
  { path: '**', redirectTo: '' }
];
