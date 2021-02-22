import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { FirebaseAuthService } from './shared/firbase-auth.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthGuard implements CanActivate {

  constructor(public auth: FirebaseAuthService, public router: Router){}

  canActivate(): boolean {
    if(this.auth.isLoggedIn){
      return true
    }
    else 
      if(localStorage.getItem("RvawolAdmin") != null){
        localStorage.removeItem("RvawolAdmin");
      }

      if(localStorage.getItem("RvawolAccessToken")){
        localStorage.removeItem("RvawolAccessToken");
      }
      this.router.navigate(['/login'])
      return false;
  }
}
