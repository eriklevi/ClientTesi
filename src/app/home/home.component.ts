import { Component, OnInit } from '@angular/core';
import {UserService} from '../_services/user.service';
import {AuthenticationService} from '../_services/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userName: string;
  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }
  ngOnInit() {
    this.userName = this.authenticationService.currentUserValue.username;
    this.router.navigate(['/dashboard']);
  }
}
