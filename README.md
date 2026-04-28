# VK Marusya

Frontend SPA для поиска фильмов, просмотра карточек, работы с жанрами и личным кабинетом пользователя.

Проект построен на React + TypeScript с акцентом на типобезопасность, работу с серверным состоянием и предсказуемый UX в сценариях loading/error.

## Функциональность

- Главная страница с Hero-блоком и списком топ-10 фильмов
- Поиск фильмов с debounce
- Страница фильма с подробной информацией
- Каталог по жанрам и список фильмов выбранного жанра
- Регистрация, авторизация и выход
- Защищенный роут аккаунта
- Добавление и удаление фильмов в избранное
- Обработка состояний загрузки и ошибок
- Адаптивный интерфейс для desktop/mobile

## Технологии

- React
- TypeScript (`strict`)
- React Router
- TanStack React Query
- Zod (валидация входных/выходных данных)
- Vite
- Vitest + Testing Library
- ESLint + Prettier
- CSS + BEM

## Архитектурные решения

- Разделение на слои: `api`, `hooks`, `components`, `pages`, `contexts`
- Вынесенные API-модули для `auth`, `movies`, `favorites`
- Кастомные хуки для поиска, избранного, локального хранилища, device detection
- Централизованный `QueryClient` с дефолтными стратегиями кэширования
- `AuthContext` для пользовательского состояния и модальных форм
- Валидация API-контрактов через Zod для раннего обнаружения невалидных данных
- Набор unit-тестов для хуков, UI-компонентов и контекста авторизации

## Структура проекта

```text
src/
  api/
    auth/
    movies/
    favorites/
    queryClient.ts
  assets/
  components/
  contexts/
  hooks/
  pages/
  App.tsx
  main.tsx
```

## Быстрый старт

### 1) Установка зависимостей

```bash
npm install
```

### 2) Запуск в dev-режиме

```bash
npm run dev
```

### 3) Проверка линтером

```bash
npm run lint
```

### 4) Запуск тестов

```bash
npm run test
```

### 5) Production сборка

```bash
npm run build
```

### 6) Локальный предпросмотр сборки

```bash
npm run preview
```

## Скрипты

- `npm run dev` - запуск Vite dev server
- `npm run build` - проверка TypeScript + production build
- `npm run lint` - запуск ESLint
- `npm run test` - запуск Vitest
- `npm run preview` - предпросмотр production сборки
- `npm run deploy` - публикация `dist` через `gh-pages`

## Тестирование

В проекте есть unit-тесты для ключевой логики:

- кастомные хуки (`useDebounce`, `useDevice`, `useFavorites`, `useLocalStorage`, `useSearch`, `useToggle`, `useMoviesByGenre`)
- UI-компоненты (`Button`, `Modal`, `SearchList`, `Login`, `RegisterForm`, `MovieCard`, `FavoriteItem`)
- контекст авторизации (`AuthContext`)
- утилиты (`ratingColor`)

Для запуска тестов:

```bash
npm run test
```

## API

Проект использует внешний backend API:

- `https://cinemaguide.skillbox.cc/movie`
- `https://cinemaguide.skillbox.cc/auth/*`
- `https://cinemaguide.skillbox.cc/favorites`

Запросы выполняются с `credentials: include`, поэтому для части функциональности требуется авторизация.

## Ссылки

- Репозиторий: `https://github.com/Spectre113/Marusya`
- Деплой: `https://spectre113.github.io/Marusya/`

## Что можно улучшить

- Добавить CI pipeline (`lint + build + test`)
- Добавить integration/e2e тесты для пользовательских сценариев
- Улучшить пользовательские уведомления об ошибках (`toast` / inline feedback)
