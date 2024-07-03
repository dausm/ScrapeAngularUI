import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-current-day',
  standalone: true,
  imports: [RouterOutlet],
  template: `
  <div class="min-h-screen">
    <router-outlet name="nav"></router-outlet>
  </div>
  `,
  styleUrl: './current-day.component.scss'
})
export class CurrentDayComponent {

}
