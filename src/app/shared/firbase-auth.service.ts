import { Injectable, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { User } from 'firebase';
import { DataManageService } from './data-manager.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService implements OnDestroy {

  public user;
  getTokenSub: Subscription;
  authSub: Subscription;


  constructor(public afAuth: AngularFireAuth,
    private dataManager: DataManageService,
    private router: Router,
    private toast: ToastrService) {
  }

  public async doLogin(value) {
    try {
      await this.afAuth.signInWithEmailAndPassword(value.email, value.password).then(res => {

        this.authSub = this.afAuth.authState.subscribe(async user => {
          if (user) {
            this.user = user;
            localStorage.setItem('RvawolAdmin', JSON.stringify(user.uid));
            localStorage.setItem('RvawolAdminUser', JSON.stringify(user.displayName ? user.displayName : user.email));
          } else {
            if (localStorage.getItem('RvawolAdmin'))
              localStorage.removeItem('RvawolAdmin');
            if (localStorage.getItem('RvawolAccessToken'))
              localStorage.removeItem('RvawolAccessToken')
            if (localStorage.getItem('RvawolAdminUser')) {
              localStorage.removeItem('RvawolAdminUser');
            }
          }
          await this.getToken();
        })
      })
    } catch (e) {
      this.toast.warning(`${e.message}`, 'Notice');
    }
  }
  
  public async getToken() {
    const fd = new FormData();
    fd.append('uid', this.user.uid);
    this.getTokenSub = this.dataManager.getToken(fd).subscribe(res => {
      const accessToken = res.access_token;
      localStorage.setItem('RvawolAccessToken', JSON.stringify(accessToken))
      this.router.navigate(['/home']);
      window.location.reload();
    },
      err => {
        this.router.navigate(['/login']);
      })
  }

  public async doSignout() {
    await this.afAuth.signOut();
    localStorage.removeItem('RvawolAdmin');
    localStorage.removeItem('RvawolAccessToken');
    this.router.navigate(['/login']);
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('RvawolAdmin'));
    return user !== null;
  }

  ngOnDestroy() {
    if (this.getTokenSub) {
      this.getTokenSub.unsubscribe();
    }
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

}