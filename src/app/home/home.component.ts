import { Component, OnInit } from '@angular/core';
import { AutoScrollComponent } from '../shared/auto-scroll.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends AutoScrollComponent implements OnInit {

  public username: string;


  constructor() { super() }

  ngOnInit() {
    const user = localStorage.getItem('RvawolAdminUser')
    this.username = user
      ? JSON.parse(localStorage.getItem('RvawolAdminUser'))
      : 'Admin';
  }

}
