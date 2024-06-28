import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-weekly-averages',
  standalone: true,
  imports: [RouterOutlet],
  template: `
  <div class="min-h-screen">
    <router-outlet name="nav"></router-outlet>
  </div>
  `,
  styleUrl: './weekly-averages.component.scss'
})

export class WeeklyAveragesComponent {

}
