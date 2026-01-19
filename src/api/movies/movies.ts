import { z } from 'zod';

export const GetMoviesQuerySchema = z.object({
  count: z.number().int().optional().default(50),
  page: z.number().int().optional().default(1),
  title: z.string().optional(),
  genre: z.string().optional(),
});

export type GetMoviesQuery = z.infer<typeof GetMoviesQuerySchema>;

export const MovieSchema = z.object({
  keywords: z.array(z.string()),
  backdropUrl: z.string().nullable().optional(),
  production: z.string().nullable().optional(),
  trailerYoutubeId: z.string().nullable().optional(),
  language: z.string(),
  tmdbRating: z.number(),
  title: z.string(),
  cast: z.array(z.string()),
  revenue: z.string().nullable().optional(),
  posterUrl: z.string().nullable().optional(),
  plot: z.string(),
  genres: z.array(z.string()),
  id: z.number(),
  budget: z.string().nullable().optional(),
  languages: z.array(z.string()),
  releaseDate: z.string(),
  director: z.string().nullable().optional(),
  awardsSummary: z.string().nullable().optional(),
  runtime: z.number(),
  trailerUrl: z.string(),
  relaseYear: z.number().nullable().optional(),
  countriesOfOrigin: z.array(z.string()),
  originalTitle: z.string(),
  searchL: z.string(),
  homepage: z.string(),
  status: z.string(),
});

export type Movie = z.infer<typeof MovieSchema>;

export const MoviesList = z.array(MovieSchema);

export type MoviesList = z.infer<typeof MoviesList>;

export async function fetchMoviesList(params?: Partial<GetMoviesQuery>): Promise<MoviesList> {
  const baseUrl = 'https://cinemaguide.skillbox.cc/movie';
  let url = baseUrl;

  if (params) {
    const searchParams = new URLSearchParams();

    if (params.count !== undefined) {
      searchParams.append('count', params.count.toString());
    }
    if (params.page !== undefined) {
      searchParams.append('page', params.page.toString());
    }
    if (params.title !== undefined && params.title !== '') {
      searchParams.append('title', params.title);
    }
    if (params.genre !== undefined && params.genre !== '') {
      searchParams.append('genre', params.genre);
    }

    const queryString = searchParams.toString();
    if (queryString) {
      url = `${baseUrl}?${queryString}`;
    }
  }

  return fetch(url, {
    credentials: 'include',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      return response.json();
    })
    .then((data) => MoviesList.parse(data));
}

export async function fetchTopMovies(): Promise<MoviesList> {
  return fetch('https://cinemaguide.skillbox.cc/movie/top10', {
    credentials: 'include',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      return response.json();
    })
    .then((data) => MoviesList.parse(data));
}

export async function fetchRandomMovie(): Promise<Movie> {
  return fetch('https://cinemaguide.skillbox.cc/movie/random', {
    credentials: 'include',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      return response.json();
    })
    .then((data) => MovieSchema.parse(data));
}

export async function fetchMovie(id: number): Promise<Movie> {
  return fetch(`https://cinemaguide.skillbox.cc/movie/${id}`, {
    credentials: 'include',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      return response.json();
    })
    .then((data) => MovieSchema.parse(data));
}
