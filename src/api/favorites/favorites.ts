import { z } from 'zod';
import { MovieSchema } from '../movies/movies';

export const FavoriteMovieSchema = MovieSchema;

export type FavoriteMovie = z.infer<typeof FavoriteMovieSchema>;

export const FavoriteMovieListSchema = z.array(FavoriteMovieSchema);

export type FavoriteMovieList = z.infer<typeof FavoriteMovieListSchema>;

export const AddFavoriteRequestSchema = z.object({
  id: z.string().nonempty(),
  name: z.string(),
  email: z.email(),
  surname: z.string(),
});

export type AddFavoriteRequest = z.infer<typeof AddFavoriteRequestSchema>;

export const UserFavoritesResponseSchema = z.object({
  favorites: z.array(z.string()).optional(),
  surname: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
});

export const UserFavoritesErrorSchema = z.object({
  error: z.string(),
});

export type UserFavoritesError = z.infer<typeof UserFavoritesErrorSchema>;

export type UserFavoritesResponse = z.infer<typeof UserFavoritesResponseSchema>;

export async function fetchFavorites(): Promise<FavoriteMovieList> {
  return fetch('https://cinemaguide.skillbox.cc/favorites', {
    credentials: 'include',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      return response.json();
    })
    .then((data) => FavoriteMovieListSchema.parse(data));
}

export async function addToFavorites(data: AddFavoriteRequest): Promise<UserFavoritesResponse> {
  return fetch('https://cinemaguide.skillbox.cc/favorites', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      id: data.id,
      name: data.name,
      email: data.email,
      surname: data.surname,
    }),
  })
    .then(async (response) => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 400) {
        const errorData = await response.json();
        const error = UserFavoritesErrorSchema.parse(errorData);
        throw new Error(error.error);
      } else {
        throw new Error('An error occurred');
      }
    })
    .then((data) => UserFavoritesResponseSchema.parse(data));
}

export async function deleteFromFavorites(movieId: number): Promise<UserFavoritesResponse> {
  return fetch(`https://cinemaguide.skillbox.cc/favorites/${movieId}`, {
    method: 'DELETE',
    credentials: 'include',
  })
    .then(async (response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('An error occurred');
      }
    })
    .then((data) => UserFavoritesResponseSchema.parse(data));
}
