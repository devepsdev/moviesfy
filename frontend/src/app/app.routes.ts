import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { MovieList } from './pages/movie-list/movie-list';
import { MovieForm } from './components/movie-form/movie-form';
import { MovieDetail } from './components/movie-detail/movie-detail';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'movies', component: MovieList },
  { path: 'movies/new', component: MovieForm },
  { path: 'movies/:id', component: MovieDetail },
  { path: 'movies/:id/edit', component: MovieForm },
];
