import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Componente principal de la página de inicio.
 * Muestra el banner hero y categorías destacadas.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {}
