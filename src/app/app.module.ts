import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment';

// Social
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";

// Material
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatListModule} from '@angular/material/list';
import {MatSnackBarModule} from '@angular/material/snack-bar';

import { ErrorInterceptor } from './_helpers';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';


let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(environment.gglKey)
  },
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [ 
    AppComponent,
    LoginComponent,
    DashboardComponent,
    ProfileComponent,
    SubscriptionsComponent,
	
  ],
  imports: [
    BrowserModule,
	HttpClientModule,
    AppRoutingModule,
	MatTableModule,
	FlexLayoutModule,
    BrowserAnimationsModule,
	MatToolbarModule,
	SocialLoginModule,
	MatButtonModule,
	MatSelectModule,
	MatPaginatorModule,
	MatCheckboxModule,
	MatFormFieldModule,
	MatInputModule,
	MatIconModule,
	MatMenuModule,
	MatListModule,
	ReactiveFormsModule,
	MatSnackBarModule
  ],
  providers: [
	{provide: AuthServiceConfig,useFactory: provideConfig},
	{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },],
  bootstrap: [AppComponent]
})
export class AppModule { }
