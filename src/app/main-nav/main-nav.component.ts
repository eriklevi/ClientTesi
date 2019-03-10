import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {AuthenticationService} from '../_services/authentication.service';
import {Router} from '@angular/router';
import {UserService} from '../_services/user.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private userService: UserService,
    private breakpointObserver: BreakpointObserver,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  userIsAdmin() {
    return this.authenticationService.currentUserValue.authorities.includes('ADMIN');
  }

  navigateProbes() {
    this.router.navigate(['/sniffers']);
  }

  navigateUsers() {
    this.router.navigate(['/users']);
  }

  navigateHome() {
    this.router.navigate(['/dashboard']);
  }

}
