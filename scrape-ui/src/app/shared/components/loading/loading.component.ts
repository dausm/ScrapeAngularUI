import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [],
  template: `
  <div class="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600">
    <span class="sr-only">Loading</span>
  </div>
  `,
})
export class LoadingComponent {}
