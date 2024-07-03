import { Routes } from '@angular/router';
import { NavComponent } from './shared/components/nav/nav.component';
import { CurrentDayComponent } from './views/current-day/current-day.component';
import { CurrentWeekComponent } from './views/current-week/current-week.component';
import { HomeComponent } from './views/home/home.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { WeeklyAveragesComponent } from './views/weekly-averages/weekly-averages.component';

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
      {path: '', outlet:'nav', component:NavComponent}
    ]
  },
  { path: '**', component: NotFoundComponent,
    children: [
      {path: '', outlet:'nav', component:NavComponent}
    ]
  }
];
