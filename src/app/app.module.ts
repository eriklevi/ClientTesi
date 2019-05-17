import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { routing } from './app.routing';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { AlertComponent } from './alert/alert.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { UsersListComponent } from './users-list/users-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {JwtInterceptor} from './_helpers/jwt.interceptor';
import {ErrorInterceptor} from './_helpers/error.interceptor';
import { UserCreatorComponent } from './user-creator/user-creator.component';
import { UserUpdaterComponent } from './user-updater/user-updater.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import {UserService} from './_services/user.service';
import {SnifferService} from './_services/sniffer.service';
import {AuthenticationService} from './_services/authentication.service';
import {AlertService} from './_services/alert.service';
import { SnifferListComponent } from './sniffer-list/sniffer-list.component';
import { SnifferCreatorComponent } from './sniffer-creator/sniffer-creator.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatFormFieldModule,
  MatOptionModule,
  MatSelectModule,
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatCardModule,
  MatDividerModule,
  MatCheckboxModule,
  MatMenuModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatTableModule, MatDialogModule, MatSnackBarModule, MatSliderModule, MatDatepickerModule, MatSlideToggleModule
} from '@angular/material';
import {BuildingService} from './_services/building.service';
import {RoomService} from './_services/room.service';
import { RoomCreatorComponent } from './room-creator/room-creator.component';
import { BuildingCreatorComponent } from './building-creator/building-creator.component';
import { BuildingListComponent } from './building-list/building-list.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { SnifferDetailComponent } from './sniffer-detail/sniffer-detail.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ChartsModule} from 'ng2-charts';
import { CountedPacketsChartComponent } from './counted-packets-chart/counted-packets-chart.component';
import { SnifferUpdaterComponent } from './sniffer-updater/sniffer-updater.component';
import { CustomSelectionComponent } from './custom-selection/custom-selection.component';
import {CountedPacketsService} from './_services/counted-packets.service';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import { CustomSelectionPageComponent } from './custom-selection-page/custom-selection-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    AlertComponent,
    UsersListComponent,
    DashboardComponent,
    UserCreatorComponent,
    UserUpdaterComponent,
    UserDetailComponent,
    SnifferListComponent,
    SnifferCreatorComponent,
    RoomCreatorComponent,
    BuildingCreatorComponent,
    BuildingListComponent,
    MainNavComponent,
    SnifferDetailComponent,
    CountedPacketsChartComponent,
    SnifferUpdaterComponent,
    CustomSelectionComponent,
    CustomSelectionPageComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    routing,
    FormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatDividerModule,
    MatCheckboxModule,
    MatMenuModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTableModule,
    FlexLayoutModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSliderModule,
    ChartsModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatSlideToggleModule
  ],
  providers: [
    UserService,
    SnifferService,
    AuthenticationService,
    AlertService,
    BuildingService,
    RoomService,
    CountedPacketsService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
