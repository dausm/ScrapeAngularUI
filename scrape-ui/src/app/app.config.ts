import { provideHttpClient, withJsonpSupport } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { NavComponent } from './shared/components/nav/nav.component';
import { CurrentDayComponent } from './views/current-day/current-day.component';
import { CurrentMonthComponent } from './views/current-month/current-month.component';
import { CurrentWeekComponent } from './views/current-week/current-week.component';
import { HomeComponent } from './views/home/home.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { WeeklyAveragesComponent } from './views/weekly-averages/weekly-averages.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      [
        { path: '', redirectTo: 'home', pathMatch: 'full' }, //default route
        { path: 'home', component: HomeComponent },
        { path: 'current-day', component: CurrentDayComponent,
          children: [
            {path: '', outlet:'nav', component:NavComponent}
          ]
        },
        { path: 'current-week', component: CurrentWeekComponent,
          children: [
            {path: '', outlet:'nav', component:NavComponent}
          ]
        },
        { path: 'current-month', component: CurrentMonthComponent,
          children: [
            {path: '', outlet:'nav', component:NavComponent}
          ]
        },
        { path: 'weekly-averages', component: WeeklyAveragesComponent,
          children: [
            {path: '', outlet:'nav', component:NavComponent}
          ]
        },
        { path: '**', component: NotFoundComponent,
          children: [
            {path: '', outlet:'nav', component:NavComponent}
          ]
        }
      ],
      withViewTransitions(),
      withComponentInputBinding()
    ),
    provideNoopAnimations(),
    provideHttpClient(withJsonpSupport())
  ]
};
