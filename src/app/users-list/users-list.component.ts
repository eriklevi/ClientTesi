import { Component, OnInit } from '@angular/core';
import {UserService} from '../_services/user.service';
import {User} from '../_models/user';
import {Router} from '@angular/router';
import {AuthenticationService} from '../_services/authentication.service';

@Component({
  selector: 'app-user-viewer',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  userList: User[];
  displayedColumns: string[] = ['username', 'mail', 'roles', 'details', 'update', 'delete' ];


  constructor(
    private userService: UserService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
  }

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService
      .getUsers()
      .subscribe(
        users => {
          this.userList = users;
          // we remove the user
          const index = this.userList.findIndex(x => x.username === this.authenticationService.currentUserValue.username);
          if (index > -1) {
            this.userList.splice(index, 1);
          }
        }, error => {
          console.log(error.name);
        }
      );
  }

  updateUser(id: string) {
    this.router.navigate(['users', id, 'update']);
  }

  deleteUser(id: string) {
    this.userService.deleteUser(id).subscribe(
      data => {
        const index: number = this.userList.findIndex(user => user.id === id);
        this.userList.splice(index, 1);
      }, error => {
        console.log(error.name);
      }
    );
  }

}
