import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { CreateHowToComponent } from './create-how-to/create-how-to.component';
import { LoginComponent } from './login/login.component';
import { FirebaseAuthGuard } from './firebase-auth.guard'
import { EditPostComponent } from './edit-post/edit-post.component';
import { HowTosComponent } from './how-tos/how-tos.component';
import { EditHowToComponent } from './edit-how-to/edit-how-to.component';
import { PostsComponent } from './posts/posts.component';
import { EmailComponent } from './email/email.component';
import { EditHomePageComponent } from './edit-home-page/edit-home-page.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  {
    path: '', canActivate: [FirebaseAuthGuard], children: [
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'create-post', component: CreatePostComponent, pathMatch: 'full' },
      { path: 'posts', component: PostsComponent },
      { path: 'create-how-to', component: CreateHowToComponent, pathMatch: 'full' },
      { path: 'how-tos', component: HowTosComponent, pathMatch: 'full' },
      { path: 'edit-post/:postID', component: EditPostComponent },
      { path: 'edit-how-to/:howtoID', component: EditHowToComponent },
      { path: 'edit-home-page', component: EditHomePageComponent, pathMatch: 'full' },
      { path: 'send-email', component: EmailComponent },
      { path: '**', component: HomeComponent }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
