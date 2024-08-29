import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <footer class="flex justify-between mx-6 py-3">
      <span>{{lastUpdate()}}</span>
      <span>&copy; Gym Charts {{year}}</span>
    </footer>
  `
})
export class FooterComponent {
  lastUpdate: InputSignal<string> = input.required<string>();
  year: number = new Date().getFullYear();
}
