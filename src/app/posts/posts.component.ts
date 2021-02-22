import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataManageService } from './../shared/data-manager.service'
import { Post } from '../shared/post.model';
import { Router } from '@angular/router';
import { AutoScrollComponent } from '../shared/auto-scroll.component';
import { faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent extends AutoScrollComponent implements OnInit, OnDestroy {

  faPlus = faPlus;
  faEdit = faEdit;
  public posts$: Post[];
  title = 'rvawol';
  allPostsSub: Subscription;

  constructor(private dataManager: DataManageService, private router: Router) { super() }

  ngOnInit() {
    this.allPostsSub = this.dataManager.getAllPosts().subscribe(res => {
      res.forEach(x => {
        res[res.indexOf(x)].createDate = new Date(res[res.indexOf(x)].createDate).toLocaleDateString();
      });
      this.posts$ = res.sort((a, b) => { return new Date(a.createDate) > new Date(b.createDate) ? -1 : 1 });
    });
  }

  public goBack(): void {
    this.router.navigate(['/'])
  }

  ngOnDestroy() {
    this.allPostsSub.unsubscribe();
  }
}
