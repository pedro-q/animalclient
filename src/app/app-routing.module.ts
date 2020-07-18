import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './_guards'; 
import { ProfileComponent } from './profile/profile.component'; 
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';


const routes: Routes = [
	{ path: '', component: LoginComponent, pathMatch: 'full' },
	{ path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard]},
	{ path: "dashboard/profile", component: ProfileComponent, pathMatch: 'full',  canActivate: [AuthGuard]},
	{ path: "dashboard/subscriptions", component: SubscriptionsComponent, pathMatch: 'full', canActivate: [AuthGuard]},
	{ path: "dashboard/:userkey", component: DashboardComponent, canActivate: [AuthGuard]},
	{ path: '**', redirectTo: '' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
}) 
export class AppRoutingModule { }
