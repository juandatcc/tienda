import { Component, ViewChild, ElementRef } from '@angular/core';
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
})
export class HomeComponent {
  @ViewChild('carouselContainer') carouselContainer!: ElementRef;

  scrollCarousel(direction: 'left' | 'right') {
    const container = this.carouselContainer.nativeElement;
    const scrollAmount = 400; // Desplazamiento en píxeles

    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }
}
