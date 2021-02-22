import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { FirebaseAuthService } from '../shared/firbase-auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  config: Object = {
    additional: {
      distance: 0, showTop: true
    }, cls: 'warning', timeout: 2000
  }

  constructor(private authService: FirebaseAuthService,
    private fb: FormBuilder,
    private router: Router,
    private toast: ToastrService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: new FormControl(),
      password: new FormControl()
    })

    if (this.authService.isLoggedIn) {
      this.router.navigate(['/home']);
    }
  }

  tryLogin() {
    const emailField = this.loginForm.value.email;
    const passwordField = this.loginForm.value.password;
    if (!emailField) {
      this.toast.show('Email is required', 'Notice');
    } else if (!passwordField) {
      this.toast.show('Password is required', 'Notice');
    } else {
      this.authService.doLogin(this.loginForm.value)
    }
  }
}


