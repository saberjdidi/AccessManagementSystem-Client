import { Component, effect, inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Menu } from '../../interfaces/menu';
import { RoleService } from '../../services/role.service';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-app-menu',
  standalone: true,
  imports: [MaterialModule, RouterOutlet, RouterLink],
  templateUrl: './app-menu.component.html',
  styleUrl: './app-menu.component.css'
})
export class AppMenuComponent implements OnInit {

  menulist!:Menu[];
  fullName: string = ''
  roles: string[] = [];
  showmenu = false;
  snackBar = inject(MatSnackBar);
  authService = inject(AuthService);

  constructor(private service: RoleService, private router: Router){
    effect(() => {
      this.menulist = this.service._menulist();
    })
  }

  ngOnInit(): void {
    //let userrole = localStorage.getItem('userrole') as string;
    let userDetail = this.authService.getUserDetail();
    let roles = userDetail?.roles;
    console.log(`roles : ${roles}`);
    this.service.Loadmenubyrole(roles).subscribe(item => {
      //console.log(`item : ${item}`);
      this.menulist = item;
      console.log(`menulist : ${this.menulist[0].code}`);
    })
  }

  ngDoCheck(): void {
    let userDetail = this.authService.getUserDetail();
    this.fullName = userDetail?.fullName as string;
    this.roles = userDetail?.roles as string[];
    //this.fullName = localStorage.getItem('username') as string;
    this.Setaccess();
  }

  Setaccess() {
    let userrole = localStorage.getItem('userrole');
    let currentUrl = this.router.url;
    if (currentUrl === '/register' || currentUrl === '/login' || currentUrl === '/reset-password' || currentUrl === '/forget-password') {
      this.showmenu = false;
    } else {
      this.showmenu = true;
    }
  }

  isLoggedIn(){
    return this.authService.isLoggedIn();
   }

   logoutFn = () => {
    this.authService.logout();
    this.snackBar.open('Logout success', 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
    });
    this.router.navigate(['/login']);
  }

}
