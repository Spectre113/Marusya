import { z } from 'zod';

export const LogoutResponseSchema = z.object({
  result: z.boolean(),
});

export type LogoutResponse = z.infer<typeof LogoutResponseSchema>;

export async function logout(): Promise<LogoutResponse> {
  return fetch('https://cinemaguide.skillbox.cc/auth/logout', {
    credentials: 'include',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      return response.json();
    })
    .then((data) => LogoutResponseSchema.parse(data));
}
