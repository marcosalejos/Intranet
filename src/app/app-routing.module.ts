import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserUtils } from '@azure/msal-browser';
import { HomeComponent } from './componentes/home/home.component';
import { LoginComponent } from './componentes/login/login.component';
import {MsalGuard} from '@azure/msal-angular';


const routes: Routes = [
  {path: '', component: LoginComponent},
  {path:'home', component: HomeComponent}
];

const isIframe = window !== window.parent && !window.opener;

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: !BrowserUtils.isInIframe() && !BrowserUtils.isInPopup() ? 'enabledNonBlocking':'disabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
