import { Component, OnDestroy } from '@angular/core';
import { DataManageService } from './shared/data-manager.service'
import { FirebaseAuthService } from './shared/firbase-auth.service';
import { Router } from '@angular/router';
import { faHome, faMap, faInfoCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  faHome = faHome;
  faMap = faMap;
  faInfoCircle = faInfoCircle;
  faSignOutAlt = faSignOutAlt;
  title = 'rvawol';
  loggedAndVerifed = false
  public isCollapsed = false;
  routerSub: Subscription;

  constructor(private fbAuth: FirebaseAuthService, private dataManager: DataManageService, private router: Router) {
  }

  ngOnInit() {
    this.loggedAndVerifed = (localStorage.getItem('RvawolAdmin') && (this.fbAuth.isLoggedIn)) ? true : false;
    this.routerSub = this.router.events.subscribe(event => {
      if (event.constructor.name === "NavigationEnd") {
        this.loggedAndVerifed = (localStorage.getItem('RvawolAdmin') && (this.fbAuth.isLoggedIn)) ? true : false;
      }
    })
  }

  public onLogout(): void {
    this.isCollapsed = false
    this.fbAuth.doSignout()
    this.loggedAndVerifed = false;
  }

  public linkClick(event) {
    this.isCollapsed = false
  }


  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

}
