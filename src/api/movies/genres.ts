import { z } from 'zod';

export const GenreListSchema = z.array(z.string());

export type GenreList = z.infer<typeof GenreListSchema>;

export async function fetchGenre(): Promise<GenreList> {
  return fetch('https://cinemaguide.skillbox.cc/movie/genres', {
    credentials: 'include',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      return response.json();
    })
    .then((data) => GenreListSchema.parse(data));
}
