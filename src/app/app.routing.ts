import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import { AuthGuard } from './_guards/auth.guard';
import { UsersListComponent} from './users-list/users-list.component';
import {AdminGuard} from './_guards/admin.guard';
import {DashboardComponent} from './dashboard/dashboard.component';
import {UserDetailComponent} from './user-detail/user-detail.component';
import {UserCreatorComponent} from './user-creator/user-creator.component';
import {SnifferListComponent} from './sniffer-list/sniffer-list.component';
import {SnifferCreatorComponent} from './sniffer-creator/sniffer-creator.component';
import {RoomCreatorComponent} from './room-creator/room-creator.component';
import {BuildingCreatorComponent} from './building-creator/building-creator.component';
import {BuildingListComponent} from './building-list/building-list.component';
import {UserUpdaterComponent} from './user-updater/user-updater.component';
import {SnifferDetailComponent} from './sniffer-detail/sniffer-detail.component';
import {SnifferUpdaterComponent} from './sniffer-updater/sniffer-updater.component';
import {CustomSelectionPageComponent} from './custom-selection-page/custom-selection-page.component';
import {ComparePageComponent} from './compare-page/compare-page.component';
import {TrackDevicePageComponent} from './track-device-page/track-device-page.component';
import {FlowMapComponent} from './flow-map/flow-map.component';
import {PositionFlowComponent} from './position-flow/position-flow.component';
import {Flow3Component} from './flow3/flow3.component';


const appRoutes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard], children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'dashboard/countedgraph', component: CustomSelectionPageComponent},
      { path: 'dashboard/comparegraph', component: ComparePageComponent},
      { path: 'dashboard/trackone', component: TrackDevicePageComponent},
      { path: 'dashboard/flow', component: FlowMapComponent},
      { path: 'dashboard/flow2', component: Flow3Component},
      { path: 'dashboard/flow3', component: Flow3Component},
      { path: 'users', component: UsersListComponent, canActivate: [AdminGuard] },
      { path: 'users/:id/update', component: UserUpdaterComponent, canActivate: [AdminGuard]},
      { path: 'users/:id', component: UserDetailComponent, canActivate: [AdminGuard]},
      { path: 'create/user', component: UserCreatorComponent, canActivate: [AdminGuard]},
      { path: 'create/sniffer', component: SnifferCreatorComponent, canActivate: [AdminGuard]},
      { path: 'sniffers', component: SnifferListComponent, canActivate: [AdminGuard] },
      { path: 'sniffers/:id', component: SnifferDetailComponent, canActivate: [AdminGuard] },
      { path: 'sniffers/:id/update', component: SnifferUpdaterComponent, canActivate: [AdminGuard] },
      { path: 'buildings', component: BuildingListComponent, canActivate: [AdminGuard] },
      { path: 'create/building', component: BuildingCreatorComponent, canActivate: [AdminGuard] },
      { path: 'create/room', component: RoomCreatorComponent, canActivate: [AdminGuard] },
    ]},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
