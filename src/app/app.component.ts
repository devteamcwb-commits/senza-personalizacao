import { Component } from '@angular/core';
import { PersonalizacaoMainComponent } from './components/personalizacao-main/personalizacao-main.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PersonalizacaoMainComponent],
  template: '<app-personalizacao-main></app-personalizacao-main>',
  styles: []
})
export class AppComponent {
  title = 'SENZA Personalização';
}

