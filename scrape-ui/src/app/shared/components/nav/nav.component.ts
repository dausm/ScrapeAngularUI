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
      <ul class="inline-flex h-full">
        <li class="inline-flex justify-center flex-col h-full">
          <a routerLink="/current-day" class="[view-transition-name:nav-first]">
            Current Day
          </a>
        </li>
        <li class="inline-flex justify-center flex-col h-full">
          <a routerLink="/current-week" class="[view-transition-name:nav-second]">
            Previous 7 Days
          </a>
        </li>
        <li class="inline-flex justify-center flex-col h-full">
          <a routerLink="/current-month" class="[view-transition-name:nav-third]">
            Previous 30 Days
          </a>
        </li>
        <li class="inline-flex justify-center flex-col h-full">
          <a routerLink="/weekly-averages" class="[view-transition-name:nav-fourth]">
            Averages By Week
          </a>
        </li>
      </ul>
    </nav>
</header>
  `,
  styleUrl: './nav.component.scss',
})
export class NavComponent {}
