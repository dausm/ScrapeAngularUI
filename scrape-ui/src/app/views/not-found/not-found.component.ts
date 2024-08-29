import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterOutlet],
  template: `
  <div class="min-h-screen">
    <router-outlet name="nav"></router-outlet>
    <main>
      <h1>404 Not Found</h1>
      <p>Call a rescue party! It seems like you got lost.</p>
    </main>
  </div>
  `,
  styles: ``
})
export class NotFoundComponent {

}
