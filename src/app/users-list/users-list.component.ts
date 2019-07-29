import { Component, OnInit } from '@angular/core';
import {UserService} from '../_services/user.service';
import {User} from '../_models/user';
import {Router} from '@angular/router';
import {AuthenticationService} from '../_services/authentication.service';
import {AlertService} from '../_services/alert.service';

@Component({
  selector: 'app-user-viewer',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  userList: User[];
  displayedColumns: string[] = ['username', 'mail', 'roles', 'details', 'update', 'delete' ];
  requestStart = false;


  constructor(
    private userService: UserService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) {
  }

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.requestStart = true;
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
          this.requestStart = false;
        }, error => {
          this.alertService.error('Impossible to fetch users details!');
          this.requestStart = false;
        }
      );
  }

  updateUser(id: string) {
    this.router.navigate(['users', id, 'update']);
  }

  deleteUser(id: string) {
    this.requestStart = true;
    const index: number = this.userList.findIndex(user => user.id === id);
    const userName: string = this.userList[index].username;
    this.userService.deleteUser(id).subscribe(
      data => {
        this.userList.splice(index, 1);
        this.requestStart = false;
        this.alertService.success('User ' + userName + ' deleted!' );
      }, error => {
        this.alertService.error('Impossible to delete the selected user!');
        this.requestStart = false;
      }
    );
  }

}
