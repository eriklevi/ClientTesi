import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {User} from '../_models/user';
import {UserService} from '../_services/user.service';

@Component({
  selector: 'app-user-creator',
  templateUrl: './user-creator.component.html',
  styleUrls: ['./user-creator.component.css']
})
export class UserCreatorComponent implements OnInit {

  public newUser: FormGroup;

  constructor(
    private userService:UserService
  ) {
    this.newUser = new FormGroup({
      'mail': new FormControl('', Validators.compose([Validators.required, Validators.email])),
      'username': new FormControl('', Validators.compose([Validators.required])),
      'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)]))
    });
  }

  ngOnInit() {
  }

  createUser(form: NgForm) {
    const user: User = new User();
    user.password = this.newUser.get('password').value;
    user.username = this.newUser.get('username').value;
    user.mail = this.newUser.get('mail').value;
    this.userService.createUser(user).subscribe(
      data => {
        console.log('Nuovo utente creato');
      }, error1 => {
        console.log(error1.name);
      }
    );
  }
}
