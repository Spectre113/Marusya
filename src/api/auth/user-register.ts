import { z } from 'zod';

const nameSchema = z
  .string()
  .trim()
  .min(1, 'Поле обязательно')
  .max(50, 'Максимум 50 символов')
  .regex(/^[A-Za-zА-Яа-яЁё\- ]+$/, 'Недопустимые символы');

const passwordSchema = z
  .string()
  .min(8, 'Минимум 8 символов')
  .regex(/[A-Za-z]/, 'Должна быть хотя бы одна буква')
  .regex(/\d/, 'Должна быть хотя бы одна цифра');

export const UserRequestSchema = z
  .object({
    email: z.string().trim().toLowerCase().email('Некорректный email'),

    password: passwordSchema,
    confirmPassword: z.string(),

    name: nameSchema,
    surname: nameSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export type UserRequestForm = z.infer<typeof UserRequestSchema>;

export type UserRequest = Omit<UserRequestForm, 'confirmPassword'>;

export const UserResponseSchema = z.object({
  result: z.boolean().optional(),
});

export type UserResponse = { result: boolean };

export const UserErrorResponseSchema = z.object({
  error: z.string(),
});

export type UserErrorResponse = z.infer<typeof UserErrorResponseSchema>;

export async function userRegister(data: UserRequest): Promise<UserResponse> {
  return fetch('https://cinemaguide.skillbox.cc/user', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      email: data.email,
      password: data.password,
      name: data.name,
      surname: data.surname,
    }),
  }).then(async (response) => {
    if (response.status === 200) {
      return { result: true };
    } else if (response.status === 400) {
      const errorData = await response.json();
      const error = UserErrorResponseSchema.parse(errorData);
      throw new Error(error.error);
    } else if (response.status === 409) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Пользователь уже существует');
    } else {
      throw new Error('Failed to register');
    }
  });
}
