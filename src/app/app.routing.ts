import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import { AuthGuard } from './_guards/auth.guard';
import { UsersListComponent} from './users-list/users-list.component';
import {AdminGuard} from './_guards/admin.guard';
import {ProbeViewerComponent} from './probe-viewer/probe-viewer.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {UserUpdaterComponent} from './user-updater/user-updater.component';
import {UserDetailComponent} from './user-detail/user-detail.component';
import {UserCreatorComponent} from './user-creator/user-creator.component';


const appRoutes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard], children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersListComponent, canActivate: [AdminGuard] },
      { path: 'users/:username/update', component: UserUpdaterComponent, canActivate: [AdminGuard]},
      { path: 'users/:username', component: UserDetailComponent, canActivate: [AdminGuard]},
      { path: 'create/user', component: UserCreatorComponent, canActivate: [AdminGuard]},
      { path: 'probes', component: ProbeViewerComponent, canActivate: [AdminGuard] },
    ]},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
