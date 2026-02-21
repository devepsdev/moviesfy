import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Movie } from '../../models/movie';
import { Filters } from '../../models/filters';
import { MoviesService } from '../../services/movies.service';
import { Response } from '../../models/response';

@Component({
  selector: 'app-movie-list',
  imports: [FormsModule, RouterLink],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.scss',
})
export class MovieList implements OnInit {
  movies: Movie[] = [];
  loading = false;
  error: string | null = null;
  showFilters = false;
  viewMode: 'grid' | 'list' = 'grid';
  movieToDelete: Movie | null = null;

  // Paginación
  currentPage = 1;
  pageSize = 12;
  totalMovies = 0;
  totalPages = 0;

  // Filtros
  filters: Filters = {
    page: 1,
    limit: 12,
    sort: 'title',
    order: 'ASC',
  };

  constructor(private moviesService: MoviesService) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.loading = true;
    this.error = null;

    this.moviesService.getMovies(this.filters).subscribe({
      next: (response: Response) => {
        this.movies = response.results;
        this.totalMovies = response.total;
        this.currentPage = response.page;
        this.pageSize = response.limit;
        this.totalPages = Math.ceil(this.totalMovies / this.pageSize);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las películas. Por favor, intenta de nuevo.';
        this.loading = false;
        console.error('Error loading movies:', err);
      },
    });
  }

  onFilterChange(): void {
    this.filters.page = 1; // Resetear a primera página
    this.loadMovies();
  }

  clearFilters(): void {
    this.filters = {
      page: 1,
      limit: this.filters.limit,
      sort: 'title',
      order: 'ASC',
    };
    this.loadMovies();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.filters.page = page;
      this.loadMovies();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    // Ajustar si hay pocas páginas al final
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  confirmDelete(movie: Movie): void {
    this.movieToDelete = movie;
    // Usar Bootstrap modal
    const modal = new (window as any).bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
  }

  deleteMovie(): void {
    if (this.movieToDelete?._id) {
      this.moviesService.deleteMovie(this.movieToDelete._id).subscribe({
        next: () => {
          // Cerrar modal
          const modal = (window as any).bootstrap.Modal.getInstance(
            document.getElementById('deleteModal')
          );
          modal.hide();

          // Recargar lista
          this.loadMovies();
          this.movieToDelete = null;
        },
        error: (err) => {
          this.error = 'Error al eliminar la película.';
          console.error('Error deleting movie:', err);
        },
      });
    }
  }

  // Método utilitario para Math.min en el template
  Math = Math;
}
