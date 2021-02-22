import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataManageService } from '../shared/data-manager.service';
import { Router } from '@angular/router';
import { HowTo } from '../shared/howto.model';
import { AutoScrollComponent } from '../shared/auto-scroll.component';
import { faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-how-tos',
  templateUrl: './how-tos.component.html',
  styleUrls: ['./how-tos.component.css']
})
export class HowTosComponent extends AutoScrollComponent implements OnInit, OnDestroy {

  public howtos$: HowTo[];
  title = 'rvawol';
  faPlus = faPlus;
  faEdit = faEdit;
  getHowToSub: Subscription;

  constructor(private dataManager: DataManageService, private router: Router) { super() }

  ngOnInit() {
    this.getHowToSub = this.dataManager.getAllHowTos().subscribe(res => {
      if (!res) {
        this.howtos$ = []
      } else {
        res.forEach(x => {
          res[res.indexOf(x)].createDate = new Date(res[res.indexOf(x)].createDate).toLocaleDateString();
        });
        this.howtos$ = res.sort((a, b) => { return new Date(a.createDate) > new Date(b.createDate) ? -1 : 1 });
      }
    });
  }

  public goBack(): void {
    this.router.navigate(['/'])
  }

  ngOnDestroy() {
    if (this.getHowToSub) {
      this.getHowToSub.unsubscribe();
    }
  }
}
