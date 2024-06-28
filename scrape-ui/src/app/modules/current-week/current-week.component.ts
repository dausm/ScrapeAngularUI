import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../layout/footer/footer.component';

@Component({
  selector: 'app-current-week',
  standalone: true,
  template: `
    <div class="stretch-layout">
      <router-outlet name="nav"></router-outlet>
      <main class="bg-white rounded-xl mx-6 mt-4 p-4">
        <p>asdadas dasd asd asd asdasd</p>
        <p>asdadas dasd asd asd asdasd</p>
        <p>asdadas dasd asd asd asdasd</p>
        <p>asdadas dasd asd asd asdasd</p>
        <p>asdadas dasd asd asd asdasd</p>
      </main>

      <app-footer></app-footer>
    </div>
  `,
  styleUrl: './current-week.component.scss',
  imports: [RouterOutlet, FooterComponent],
})
export class CurrentWeekComponent {}
