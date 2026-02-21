export interface Filters {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
  q?: string;
  year?: number;
  minRating?: number;
  maxRating?: number;
}
