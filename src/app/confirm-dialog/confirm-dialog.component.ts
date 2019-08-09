import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AlertService} from '../_services/alert.service';
import {UserService} from '../_services/user.service';

export interface DialogData {
  name: string;
  id: string;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private alertService: AlertService,
    private usersService: UserService
  ) { }

  ngOnInit() {
  }

  deleteUser(d: DialogData) {
    this.usersService.deleteUser(d.id).subscribe(
      data => {
        this.alertService.success('User ' + d.name + ' deleted!' );
        this.dialogRef.close();
      }, error => {
        this.alertService.error('Impossible to delete the selected user!');
        this.dialogRef.close();
      }
    );
  }

  dismissDialog(): void {
    this.dialogRef.close();
  }
}
