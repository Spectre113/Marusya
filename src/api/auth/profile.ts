import { z } from 'zod';

export const ProfileResponseSchema = z.object({
  email: z.string(),
  favorites: z.array(z.string()),
  name: z.string(),
  surname: z.string(),
});

export type ProfileResponse = z.infer<typeof ProfileResponseSchema>;

export async function fetchCurrentUser(): Promise<ProfileResponse> {
  return fetch('https://cinemaguide.skillbox.cc/profile', {
    credentials: 'include',
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      return response.json();
    })
    .then((data) => ProfileResponseSchema.parse(data));
}

export const fetchProfile = fetchCurrentUser;