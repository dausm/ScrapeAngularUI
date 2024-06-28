import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterOutlet],
  template: `
  <div class="min-h-screen">
    <router-outlet name="nav"></router-outlet>
  </div>
  `,
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {

}
