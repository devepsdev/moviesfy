import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Movie } from '../../models/movie';
import { MoviesService } from '../../services/movies.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-movie-detail',
  imports: [RouterModule],
  templateUrl: './movie-detail.html',
  styleUrl: './movie-detail.scss',
})
export class MovieDetail implements OnInit {
  movie: Movie | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private moviesService: MoviesService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadMovie(id);
    }
  }

  loadMovie(id?: string): void {
    const movieId = id || this.route.snapshot.params['id'];
    this.loading = true;
    this.error = null;

    this.moviesService.getMovie(movieId).subscribe({
      next: (movie) => {
        this.movie = movie;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'No se pudo cargar la película. Puede que no exista.';
        this.loading = false;
        console.error('Error loading movie:', err);
      },
    });
  }

  confirmDelete(): void {
    const modal = new (window as any).bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
  }

  deleteMovie(): void {
    if (this.movie?._id) {
      this.moviesService.deleteMovie(this.movie._id).subscribe({
        next: () => {
          const modal = (window as any).bootstrap.Modal.getInstance(
            document.getElementById('deleteModal')
          );
          modal.hide();
          this.router.navigate(['/movies']);
        },
        error: (err) => {
          this.error = 'Error al eliminar la película.';
          console.error('Error deleting movie:', err);
        },
      });
    }
  }

  goBack(): void {
    this.location.back();
  }

  onImageError(event: any): void {
    event.target.src = 'https://via.placeholder.com/400x600/6c757d/ffffff?text=Sin+Imagen';
  }
}
