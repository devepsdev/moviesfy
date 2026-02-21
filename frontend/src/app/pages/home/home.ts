import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  // Texto breve para el hero
  subtitle = 'Explora nuestra colección de películas';

  // Ruta del GIF de demo (colócalo en /public)
  demoGifSrc = './Animation.gif';

  // Contadores opcionales (puedes alimentarlos desde la API si quieres)
  stats = {
    samplePage: 1,
    sampleLimit: 12,
    sampleTotal: 20,
  };

  // Enlaces de navegación (ajusta según tus rutas reales)
  links = {
    movies: '/movies',
    create: '/movies/new',
  };
}
