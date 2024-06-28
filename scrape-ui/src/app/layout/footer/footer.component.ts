import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <footer class="flex justify-between mx-6 py-3">
      <span> Last data fetch: </span>
      <span>&copy; Gym Charts {{year}}</span>
    </footer>
  `,
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  year: number = new Date().getFullYear();
}
