import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DataManageService } from './data-manager.service';
import { FirebaseAuthService } from './firbase-auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router, private dataManager: DataManageService, private auth:FirebaseAuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (localStorage.getItem('RvawolAccessToken') != null) {
            const clonedReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${JSON.parse(localStorage.getItem('RvawolAccessToken'))}`)
            })
            return next.handle(clonedReq).pipe(
                tap(
                    succ => { },
                    err => {
                        if (err.status == 401) {
                            localStorage.removeItem("RvawolAccessToken");
                            this.auth.doSignout();
                            this.router.navigate(['/login'])
                        }
                    }
                )
            )
        }
        else
            return next.handle(req.clone());
    }
}