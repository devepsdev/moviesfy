import { Movie } from './movie';

export interface Response {
  total: number;
  page: number;
  limit: number;
  results: Movie[];
}
