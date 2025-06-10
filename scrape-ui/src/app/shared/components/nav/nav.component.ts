import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LogoComponent } from '../logo/logo.components';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, LogoComponent, RouterLinkActive],
  template: `
    <header class="flex justify-between">
      <a routerLink="/" class="[view-transition-name:logo]">
        <app-logo></app-logo>
      </a>

      <nav class="main-nav">
        <ul class="inline-flex h-full">
          <li class="flex-col inline-flex justify-center h-full">
            <a
              routerLink="/current-day"
              routerLinkActive="active-link"
              class="[view-transition-name:nav-first]"
              [routerLinkActiveOptions]="{ exact: true }"
            >
              Current Day
            </a>
          </li>
          <li class="flex-col inline-flex justify-center h-full">
            <a
              routerLink="/current-week"
              routerLinkActive="active-link"
              class="[view-transition-name:nav-second]"
              [routerLinkActiveOptions]="{ exact: true }"
            >
              Previous 7 Days
            </a>
          </li>
          <li class="flex-col inline-flex justify-center h-full">
            <a
              routerLink="/current-month"
              routerLinkActive="active-link"
              class="[view-transition-name:nav-third]"
              [routerLinkActiveOptions]="{ exact: true }"
            >
              Previous 30 Days
            </a>
          </li>
          <li class="flex-col inline-flex justify-center h-full">
            <a
              routerLink="/weekly-averages"
              routerLinkActive="active-link"
              class="[view-transition-name:nav-fourth]"
              [routerLinkActiveOptions]="{ exact: true }"
            >
              Averages By Week
            </a>
          </li>
        </ul>
      </nav>
    </header>
  `,
})
export class NavComponent {}
