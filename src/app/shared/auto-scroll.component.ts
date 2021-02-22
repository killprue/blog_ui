import { Component } from '@angular/core';

@Component({
  selector: 'PageNotFoundComponent',
  template: ''
})
export class AutoScrollComponent {
  constructor() { setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);  }
}
