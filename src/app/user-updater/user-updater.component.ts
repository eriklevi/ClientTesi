/* tslint:disable:no-trailing-whitespace */
import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {UserService} from '../_services/user.service';
import {User} from '../_models/user';
import {ActivatedRoute} from '@angular/router';
import $ from 'jquery';
import {MaterializeModule} from 'angular2-materialize';
@Component({
  selector: 'app-user-updater',
  templateUrl: './user-updater.component.html',
  styleUrls: ['./user-updater.component.css']
})
export class UserUpdaterComponent implements OnInit {

  public group: FormGroup;
  currentUser: User;
  id: string;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {
    this.group = new FormGroup({
      'mail': new FormControl('', Validators.compose([Validators.required, Validators.email])),
      'username': new FormControl('', Validators.compose([Validators.required])),
      'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)])),
      'admin': new FormControl(),
      'sniffer': new FormControl(),
      'user': new FormControl()
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.userService.getUser(this.id).subscribe(
        user => {
          this.currentUser = user;
        }, error => {
          console.error(error.name);
        }
      );
    }, error => {
      console.error(error.name);
    });
  }

  updateUser() {
    if (this.group.invalid) {
      return;
    }
    const newUser = new User;
    newUser.id = this.currentUser.id;
    newUser.password = this.group.get('password').value;
    newUser.username = this.group.get('username').value;
    newUser.mail = this.group.get('mail').value;
    newUser.roles = [];
    if (this.group.get('admin').value) {
      newUser.roles.push('ADMIN');
    }
    if (this.group.get('user').value) {
      newUser.roles.push('USER');
    }
    if (this.group.get('sniffer').value && this.group.get('admin').value) {
      newUser.roles.push('SNIFFER');
    }
    this.userService.updateUser(newUser).subscribe(
      data => {
        console.log('Nuovo utente creato');
      }, error1 => {
        console.log(error1.name);
      }
    );
  }

  isAdmin() {
    return this.currentUser.roles.includes('ADMIN');
  }

  isUser() {
    return this.currentUser.roles.includes('USER');
  }

  isSniffer() {
    return this.currentUser.roles.includes('SNIFFER');
  }
}
