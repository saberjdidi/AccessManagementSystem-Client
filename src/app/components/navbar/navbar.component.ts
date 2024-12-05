import { Component, inject, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MaterialModule, RouterLink, RouterOutlet, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  authService = inject(AuthService);
  router = inject(Router);
  matSnackBar = inject(MatSnackBar);

  @ViewChild('drawer') drawer: MatDrawer | undefined;

  toggleDrawer() {
    console.log('Toggling drawer');
    this.drawer?.toggle();
  }

  isLoggedIn(){
   return this.authService.isLoggedIn();
  }

  logoutFn = () => {
    this.authService.logout();
    this.matSnackBar.open('Logout success', 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
    });
    this.router.navigate(['/login']);
  }
}
