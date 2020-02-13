import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NotifierModule, notifierCustomConfigFactory, NotifierOptions } from "angular-notifier";
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CryptoService } from './services/crypto.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthenticateService } from './services/authenticate.service';
import { AuthGuard } from './services/auth.guard';
import { NotifierSetting } from './config/notifier-setting';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule, NgbPaginationModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { Page404Component } from './page404/page404.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ContentComponent } from './content/content.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgxBootstrapModule } from './ngx-bootstrap.module';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    Page404Component,
    NavigationComponent,
    DashboardComponent,
    ContentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    NgbPaginationModule,
    NgbAlertModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NotifierModule.withConfig(NotifierSetting),
    NgxBootstrapModule
  ],
  providers: [CryptoService, AuthenticateService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
