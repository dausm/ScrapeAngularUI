import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="grid gap-4 grid-cols-2 content-center min-h-screen">
      <div class="flex flex-col justify-center items-center">
        <img
          src="../../../assets/Gym-Charts-Logo.svg"
          alt="Logo"
          class="home-logo [view-transition-name:logo]"
          routerLink="/"
        />

        <h1 class="text-6xl">Gym Charts</h1>

        <p class="max-w-xl">
          Welcome to gym charts. Here you can see the occupancy data displayed
          as charts for the Adventure Rock gym chain in Wisconsin. Click one of
          the options to view stats.
        </p>
      </div>

      <div>
        <nav>
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
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
