import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Movie } from '../../models/movie';
import { Location } from '@angular/common';
import { MoviesService } from '../../services/movies.service';

@Component({
  selector: 'app-movie-form',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './movie-form.html',
  styleUrl: './movie-form.scss',
})
export class MovieForm implements OnInit {
  movieForm: FormGroup;
  movie: Movie | null = null;
  isEditMode = false;
  loading = false;
  submitting = false;
  error: string | null = null;

  // Imágenes placeholder como constantes
  private readonly PLACEHOLDER_PREVIEW =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjNmM3NTdkIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjEwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCI+VmlzdGE8L3RleHQ+Cjx0ZXh0IHg9IjE1MCIgeT0iMjMwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCI+UHJldmlhPC90ZXh0Pgo8L3N2Zz4=';

  private readonly PLACEHOLDER_ERROR =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjZGMzNTQ1Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCI+VVJMPC90ZXh0Pgo8dGV4dCB4PSIxNTAiIHk9IjIyMCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9ImNlbnRyYWwiPkludmFsaWRhPC90ZXh0Pgo8dGV4dCB4PSIxNTAiIHk9IjI0MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9ImNlbnRyYWwiPk8gTm8gRGlzcG9uaWJsZTwvdGV4dD4KPHN2Zz4=';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private moviesService: MoviesService
  ) {
    this.movieForm = this.createForm();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id && this.route.snapshot.url[2]?.path === 'edit') {
      this.isEditMode = true;
      this.loadMovie(id);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.maxLength(255)]],
      year: ['', [Validators.min(1888), Validators.max(2100)]],
      rating: ['', [Validators.min(0), Validators.max(10)]],
      votes: ['', [Validators.min(0)]],
      image_url: ['', [Validators.pattern('https?://.+')]],
    });
  }

  loadMovie(id: string): void {
    this.loading = true;
    this.moviesService.getMovie(id).subscribe({
      next: (movie) => {
        this.movie = movie;
        this.movieForm.patchValue(movie);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'No se pudo cargar la película para editar.';
        this.loading = false;
        console.error('Error loading movie:', err);
      },
    });
  }

  onSubmit(): void {
    if (this.movieForm.invalid) {
      this.markAllFieldsAsTouched();
      return;
    }

    this.submitting = true;
    this.error = null;

    const movieData = this.getFormData();

    if (this.isEditMode && this.movie?._id) {
      // Actualizar película existente
      this.moviesService.updateMovie(this.movie._id, movieData).subscribe({
        next: () => {
          this.submitting = false;
          this.router.navigate(['/movies', this.movie!._id]);
        },
        error: (err) => {
          this.error = 'Error al actualizar la película. Intenta de nuevo.';
          this.submitting = false;
          console.error('Error updating movie:', err);
        },
      });
    } else {
      // Crear nueva película
      this.moviesService.createMovie(movieData as Movie).subscribe({
        next: (result) => {
          this.submitting = false;
          this.router.navigate(['/movies', result.insertId]);
        },
        error: (err) => {
          this.error = 'Error al crear la película. Intenta de nuevo.';
          this.submitting = false;
          console.error('Error creating movie:', err);
        },
      });
    }
  }

  getFormData(): Partial<Movie> {
    const formValue = this.movieForm.value;
    const movieData: Partial<Movie> = {};

    // Solo incluir campos que tengan valor
    if (formValue.title) movieData.title = formValue.title.trim();
    if (formValue.description) movieData.description = formValue.description.trim();
    if (formValue.year) movieData.year = Number(formValue.year);
    if (formValue.rating) movieData.rating = Number(formValue.rating);
    if (formValue.votes) movieData.votes = Number(formValue.votes);
    if (formValue.image_url) movieData.image_url = formValue.image_url.trim();

    return movieData;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.movieForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  markAllFieldsAsTouched(): void {
    Object.keys(this.movieForm.controls).forEach((key) => {
      this.movieForm.get(key)?.markAsTouched();
    });
  }

  resetForm(): void {
    if (this.isEditMode && this.movie) {
      this.movieForm.patchValue(this.movie);
    } else {
      this.movieForm.reset();
    }
    this.error = null;
  }

  goBack(): void {
    this.location.back();
  }

  onImageUrlChange(): void {
    // La vista previa se actualiza automáticamente mediante el binding
  }

  getPreviewImage(): string {
    const imageUrl = this.movieForm.get('image_url')?.value?.trim();

    // Si no hay URL, mostrar placeholder de vista previa
    if (!imageUrl) {
      return this.PLACEHOLDER_PREVIEW;
    }

    // Si hay URL, intentar mostrarla
    return imageUrl;
  }

  onPreviewImageError(event: any): void {
    // Si la imagen falla al cargar, mostrar placeholder de error
    event.target.src = this.PLACEHOLDER_ERROR;
  }

  // Método auxiliar para validar URLs de imagen
  isValidImageUrl(url: string): boolean {
    if (!url) return false;

    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }
}
