import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink],
  template: `
  <header class="flex justify-between">
    <img
      src="../../../assets/Gym-Charts-Logo.svg"
      alt="Logo"
      class="home-logo [view-transition-name:logo]"
      routerLink="/"
    />

    <nav class="main-nav">
      <ul class="inline-flex justify-center align-center mt-2">
        <li>
          <a routerLink="/current-day" class="[view-transition-name:nav-first]">
            Current Day
          </a>
        </li>
        <li>
          <a routerLink="/current-week" class="[view-transition-name:nav-second]">
            Current Week
          </a>
        </li>
        <li>
          <a routerLink="/current-month" class="[view-transition-name:nav-third]">
            Current Month
          </a>
        </li>
        <li>
          <a routerLink="/weekly-averages" class="[view-transition-name:nav-fourth]">
            Weekly Averages
          </a>
        </li>
      </ul>
    </nav>
</header>
  `,
  styleUrl: './nav.component.scss',
})
export class NavComponent {}
