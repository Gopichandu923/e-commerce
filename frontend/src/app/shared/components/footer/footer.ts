import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.html'
})
export class Footer {
  currentYear = new Date().getFullYear();
}