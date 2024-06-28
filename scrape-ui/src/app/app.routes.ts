import { Routes } from '@angular/router';
import { NavComponent } from './layout/nav/nav.component';
import { CurrentDayComponent } from './modules/current-day/current-day.component';
import { CurrentWeekComponent } from './modules/current-week/current-week.component';
import { HomeComponent } from './modules/home/home.component';
import { NotFoundComponent } from './modules/not-found/not-found.component';
import { WeeklyAveragesComponent } from './modules/weekly-averages/weekly-averages.component';

export const routes: Routes = [
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
  { path: 'weekly-averages', component: WeeklyAveragesComponent,
    children: [
      {path: 'nav', outlet:'nav', component: NavComponent}
    ]
  },
  { path: '**', component: NotFoundComponent,
    children: [
      {path: 'nav', outlet:'nav', component:NavComponent}
    ]
  }
];
