import { z } from 'zod';

export const LoginRequestSchema = z.object({
  email: z.string().trim().toLowerCase().email('Некорректный email'),
  password: z.string(),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const LoginResponseSchema = z.object({
  result: z.boolean().optional(),
});

export type LoginResponse = { result: boolean };

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const data = LoginRequestSchema.parse(request);
  return fetch('https://cinemaguide.skillbox.cc/auth/login', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      email: data.email,
      password: data.password,
    }),
  }).then(async (response) => {
    if (response.status === 200) {
      return { result: true };
    } else if (response.status === 400) {
      const body = await response
        .clone()
        .json()
        .catch(() => null);
      const msg =
        body && typeof body.error === 'string' ? body.error : 'Почта или пароль указаны неверно';
      throw new Error(msg);
    } else {
      throw new Error('Failed to login');
    }
  });
}
