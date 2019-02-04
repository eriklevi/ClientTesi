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
import { MaterializeModule } from 'angular2-materialize';
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
    SnifferCreatorComponent
  ],
  imports: [
    BrowserModule,
    MaterializeModule,
    ReactiveFormsModule,
    HttpClientModule,
    routing,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [
    UserService,
    SnifferService,
    AuthenticationService,
    AlertService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
