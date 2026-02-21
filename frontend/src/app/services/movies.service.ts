import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Filters } from '../models/filters';
import { Response } from '../models/response';
import { Movie } from '../models/movie';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private apiUrl = 'https://deveps.ddns.net/api/movies/';

  constructor(private http: HttpClient) {}

  getMovies(filters: Filters = {}): Observable<Response> {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<Response>(this.apiUrl, { params });
  }

  getMovie(id: string): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}${id}`);
  }

  createMovie(movie: Movie): Observable<{ insertId: string }> {
    return this.http.post<{ insertId: string }>(this.apiUrl, movie);
  }

  updateMovie(id: string, movie: Partial<Movie>): Observable<{ affectedRows: number }> {
    return this.http.put<{ affectedRows: number }>(`${this.apiUrl}${id}`, movie);
  }

  deleteMovie(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }
}
