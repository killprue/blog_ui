
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { HomeComponent } from './home/home.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { AuthInterceptor } from './shared/auth.interceptor';
import { EditPostComponent } from './edit-post/edit-post.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateHowToComponent } from './create-how-to/create-how-to.component';
import { HowTosComponent } from './how-tos/how-tos.component';
import { EditHowToComponent } from './edit-how-to/edit-how-to.component';
import { PostsComponent } from './posts/posts.component';
import { EmailComponent } from './email/email.component';
import { EditHomePageComponent } from './edit-home-page/edit-home-page.component'
import { AutoScrollComponent } from './shared/auto-scroll.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrModule } from 'ngx-toastr';
import { UiSwitchModule } from 'ngx-toggle-switch';
 


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CreatePostComponent,
    LoginComponent,
    EditPostComponent,
    CreateHowToComponent,
    HowTosComponent,
    EditHowToComponent,
    PostsComponent,
    EmailComponent,
    EditHomePageComponent,
    AutoScrollComponent,
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgbModule,
    FormsModule,
    FontAwesomeModule,
    UiSwitchModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
