import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {User} from '../_models/user';
import {UserService} from '../_services/user.service';
import {AlertService} from '../_services/alert.service';
import {Route, Router} from '@angular/router';

@Component({
  selector: 'app-user-creator',
  templateUrl: './user-creator.component.html',
  styleUrls: ['./user-creator.component.css']
})
export class UserCreatorComponent implements OnInit {

  public newUser: FormGroup;

  constructor(
    private userService: UserService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.newUser = new FormGroup({
      'mail': new FormControl(null, Validators.email),
      'username': new FormControl(null, Validators.compose([Validators.required])),
      'password': new FormControl(null, Validators.compose([Validators.required, Validators.minLength(8)])),
      'role': new FormControl('USER')
    });
  }

  ngOnInit() {
  }

  createUser() {
    if (this.newUser.invalid) {
      this.alertService.error('Invalid parameters!');
      return;
    }
    if (!this.newUser.get('mail').value && this.newUser.get('role').value !== 'SNIFFER') {
      this.alertService.error('Mail is required for USER and ADMIN!');
      return;
    }
    const user: User = new User();
    user.password = this.newUser.get('password').value;
    user.username = this.newUser.get('username').value;
    switch (this.newUser.get('role').value) {
      case 'USER':
        user.mail = this.newUser.get('mail').value;
        this.userService.restrictedCreateUser(user).subscribe(
          next => {
            this.alertService.success('User ' + user.username + ' created!');
            this.router.navigate(['/users']);
          }, error1 => {
            this.alertService.error('Something went wrong!');
            this.router.navigate(['/users']);
          }
        )
        break;
      case 'ADMIN':
        user.mail = this.newUser.get('mail').value;
        this.userService.restrictedCreateAdmin(user).subscribe(
          next => {
            this.alertService.success('Admin ' + user.username + ' created!');
            this.router.navigate(['/users']);
          }, error1 => {
            this.alertService.error('Something went wrong!');
            this.router.navigate(['/users']);
          }
        )
        break;
      case 'SNIFFER':
        this.userService.restrictedCreateSniffer(user).subscribe(
          next => {
            this.alertService.success('Sniffer ' + user.username + ' created!');
            this.router.navigate(['/users']);
          }, error1 => {
            this.alertService.error('Something went wrong!');
            this.router.navigate(['/users']);
          }
        )
        break;
    }
  }
}
