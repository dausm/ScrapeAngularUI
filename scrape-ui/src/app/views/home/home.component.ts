import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoComponent } from "../../shared/components/logo/logo.components";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, LogoComponent],
  template: `
    <div class="grid gap-4 grid-cols-2 content-center min-h-screen">
      <div class="flex flex-col justify-center items-center">
        <h1 class="logo-home mb-9">
          <a routerLink="/" class="[view-transition-name:logo]">
            <app-logo></app-logo>
          </a>
        </h1>

        <p class="max-w-xl">
          Welcome to climbing charts! Here you can view the occupancy data displayed
          as charts for the Adventure Rock gym chain in Wisconsin. Click one of
          the nav links to view stats.
        </p>
      </div>

      <div class="flex flex-col justify-center">
        <nav class="main-nav">
          <ul>
            <li>
              <a
                routerLink="/current-day"
                class="[view-transition-name:nav-first]"
              >
                Current Day
              </a>
            </li>
            <li>
              <a
                routerLink="/current-week"
                class="[view-transition-name:nav-second]"
              >
                Previous 7 Days
              </a>
            </li>
            <li>
              <a
                routerLink="/weekly-averages"
                class="[view-transition-name:nav-third]"
              >
                Previous 30 Days
              </a>
            </li>
            <li>
              <a
                routerLink="/weekly-averages"
                class="[view-transition-name:nav-fourth]">
                Averages By Week
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  `,
  styles: ``
})
export class HomeComponent {}
