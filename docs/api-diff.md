# Сравнение API: Бэкенд vs Фронтенд

**Дата:** 5 апреля 2026  
**Бэкенд:** FastAPI 0.1.0 — `https://ilya.burdyugov.fvds.ru/docs`  
**Фронтенд:** `app/lib/api.methods.ts`, `app/lib/api.types.ts`, `app/composables/auth/`

---

## Сводная таблица

| #   | Бэкенд (endpoint)                              | Фронтенд (метод/файл)                            | Статус                    |
| --- | ---------------------------------------------- | ------------------------------------------------ | ------------------------- |
| 1   | `POST /auth/register`                          | `useRegister` + `register()` из `api.methods.ts` | ⚠️ Различия в body        |
| 2   | `POST /auth/login`                             | `useLogin` + `login()` из `api.methods.ts`       | ⚠️ Различия в body/формат |
| 3   | `POST /auth/refresh`                           | `refresh()` из `api.methods.ts`                  | ✅ Совпадает              |
| 4   | `GET /auth/current_user`                       | **❌ Отсутствует на фронте**                     | 🔴 Нет реализации         |
| 5   | `GET /categories/`                             | `getCategories()`                                | ⚠️ Различия в типах       |
| 6   | `GET /categories/{slug}`                       | **❌ Отсутствует на фронте**                     | 🔴 Нет реализации         |
| 7   | `GET /categories/{slug}/lessons`               | `getLessons(catId)`                              | ⚠️ Различия в типах       |
| 8   | `GET /categories/{slug}/lessons/{lesson_slug}` | **❌ Отсутствует на фронте**                     | 🔴 Нет реализации         |
| 9   | `GET /categories/{slug}/progress`              | **❌ Отсутствует на фронте**                     | 🔴 Нет реализации         |
| 10  | `GET /categories/game/progress`                | **❌ Отсутствует на фронте**                     | 🔴 Нет реализации         |
| 11  | `GET /lessons/me`                              | `getProgress()` → `GET /progress`                | ⚠️ Несовпадающий путь     |
| 12  | `PATCH /lessons/progress`                      | **❌ Отсутствует на фронте**                     | 🔴 Нет реализации         |
| 13  | `PATCH /lessons/rating`                        | **❌ Отсутствует на фронте**                     | 🔴 Нет реализации         |
| 14  | `POST /lessons/{id}/complete` (из комментария) | `completeLesson()`                               | ⚠️ Нет на бэкенде         |
| 15  | `GET /categories/{catId}/hp` (фронт)           | **❌ Отсутствует на бэкенде**                    | 🔴 Нет на бэкенде         |
| 16  | `POST /hp/hit` (фронт)                         | `hitHp()`                                        | 🔴 Нет на бэкенде         |

---

## Подробное сравнение

### 1. `POST /auth/register`

**Бэкенд** (`UserRegister`):

```json
{
  "email": "string (email)",
  "password": "string",
  "name": "string" // ← Обязательное поле
}
```

**Фронтенд** (`api.types.ts` → `RegisterBody`):

```ts
{
  email: string
  password: string // ← НЕТ поля name
}
```

**Фронтенд** (`useRegister.ts`):

```ts
body: {
  ;(name, email, password)
} // ← name ПЕРЕДАЁТСЯ в useRegister, но не описан в RegisterBody
```

> ⚠️ **Проблема:** `RegisterBody` в `api.types.ts` не включает `name`, хотя `useRegister` его передаёт. Тип не синхронизирован с реальным использованием. На бэкенде `name` — обязательное поле.

---

### 2. `POST /auth/login`

**Бэкенд** — ожидает `application/x-www-form-urlencoded` (`Body_login_auth_login_post`):

```
grant_type: "password" | null
username: string          // ← ВАЖНО: "username", не "email"
password: string
scope: string (default "")
client_id: string | null
client_secret: string | null
```

**Ответ бэкенда** (`UserLoginOut`):

```json
{
  "email": "string",
  "name": "string"
}
```

**Фронтенд** (`useLogin.ts`) — отправляет JSON:

```ts
body: {
  ;(email, password)
} // ← JSON, а не form-urlencoded
```

**Фронтенд** (`LoginBody` из `api.types.ts`):

```ts
{
  email: string // ← бэкенд ожидает "username"
  password: string
}
```

> 🔴 **Критическая проблема:**
>
> 1. Бэкенд ожидает **form-urlencoded**, фронтенд отправляет **JSON**.
> 2. Бэкенд ожидает поле `username`, фронтенд отправляет `email`.
> 3. Ответ бэкенда возвращает `{ email, name }`, фронтенд типизирован как `User = { email, name }` — тут совпадает.

---

### 3. `POST /auth/refresh`

**Бэкенд:** endpoint не задокументирован в OpenAPI, но фронтенд его вызывает.  
**Фронтенд:** `refresh()` → `POST /auth/refresh` с `credentials: 'include'`.

> ⚠️ Endpoint используется, но не описан в Swagger-документации бэкенда.

---

### 4. `GET /auth/current_user` — ❌ Отсутствует на фронте

**Бэкенд** возвращает `UserMe`:

```json
{
  "id": "integer"
}
```

> 🔴 На фронте нет метода для получения текущего пользователя. Middleware `auth.global.ts` проверяет авторизацию через локальный `useUser().isAurhorized`, но не обращается к бэкенду.

---

### 5. `GET /categories/`

**Бэкенд** возвращает `CategoryOut[]`:

```json
{
  "slug": "string",
  "name": "string",
  "health": "integer",
  "diffuculty": "integer", // ← Опечатка в бэкенде: "diffuculty"
  "description": "string | null"
}
```

**Фронтенд** (`Category` из `api.types.ts`):

```ts
{
  id: string // ← Бэкенд: slug (string)
  name: string // ✅
  difficulty: 1 | 2 | 3 | 4 // ← Бэкенд: diffuculty (integer)
  progress: number // ← НЕТ на бэкенде
}
```

> 🔴 **Критические различия:**
>
> 1. Бэкенд использует `slug` как идентификатор, фронтенд — `id`.
> 2. Бэкенд: `health` (HP категории) — отсутствует на фронте.
> 3. Бэкенд: `diffuculty` (с опечаткой), фронтенд: `difficulty`.
> 4. Фронтенд: `progress` — отсутствует в ответе бэкенда.
> 5. Бэкенд: `description` — отсутствует на фронте.

---

### 6. `GET /categories/{slug}` — ❌ Отсутствует на фронте

**Бэкенд** возвращает `CategoryOut` (отдельная категория по slug).

> 🔴 На фронте нет метода для получения одной категории.

---

### 7. `GET /categories/{slug}/lessons`

**Бэкенд** возвращает `LessonOut[]`:

```json
{
  "slug": "string",
  "title": "string",
  "category_slug": "string",
  "hit": "integer",
  "diffuculty": "integer" // ← Опечатка
}
```

**Фронтенд** (`Lesson` из `api.types.ts`):

```ts
{
  id: string // ← Бэкенд: slug (string)
  title: string // ✅
  componentSlug: string // ← НЕТ на бэкенде
  difficulty: 1 | 2 | 3 | 4 // ← Бэкенд: diffuculty (integer)
  isCompleted: boolean // ← НЕТ на бэкенде
}
```

> 🔴 **Критические различия:**
>
> 1. Бэкенд: `slug` → фронтенд: `id`.
> 2. Бэкенд: `category_slug` — отсутствует на фронте.
> 3. Бэкенд: `hit` (HP урока) — отсутствует на фронте.
> 4. Фронтенд: `componentSlug` — отсутствует на бэкенде.
> 5. Фронтенд: `isCompleted` — отсутствует на бэкенде (есть в прогрессе).
> 6. `diffuculty` vs `difficulty`.

---

### 8. `GET /categories/{slug}/lessons/{lesson_slug}` — ❌ Отсутствует на фронте

**Бэкенд** возвращает `LessonOut` (один урок).

> 🔴 На фронте нет метода для получения одного урока.

---

### 9. `GET /categories/{slug}/progress` — ❌ Отсутствует на фронте

**Бэкенд** возвращает `CategoryProgressOut`:

```json
{
  "category_slug": "string",
  "completed_lessons": "integer",
  "total_lessons": "integer",
  "is_completed": "boolean"
}
```

> 🔴 На фронте нет метода для получения прогресса по категории.

---

### 10. `GET /categories/game/progress` — ❌ Отсутствует на фронте

**Бэкенд** возвращает `GameProgessOut`:

```json
{
  "total_progress": "number (0..1)",
  "completed_lessons": "integer",
  "total_lessons": "integer",
  "reputation_score": "integer"
}
```

> 🔴 На фронте нет метода для получения общего игрового прогресса.

---

### 11. `GET /lessons/me` (бэкенд) vs `GET /progress` (фронтенд)

**Бэкенд** — `GET /lessons/me` возвращает `UserLessonProgressOut[]`:

```json
{
  "lesson_slug": "string",
  "progress": "integer",
  "completed": "boolean"
}
```

**Фронтенд** — `getProgress()` → `GET /progress` возвращает `LessonProgress[]`:

```ts
{
  lessonId: string // ← Бэкенд: lesson_slug
  categoryId: string // ← НЕТ на бэкенде
  completedAt: string // ← НЕТ на бэкенде
  attempts: number // ← НЕТ на бэкенде
}
```

> 🔴 **Различия:**
>
> 1. **Разные пути:** `/lessons/me` на бэкенде, `/progress` на фронте.
> 2. Бэкенд: `lesson_slug` → фронтенд: `lessonId`.
> 3. Бэкенд: `progress` (число 0-100), `completed` (bool) — отсутствуют на фронте.
> 4. Фронтенд: `categoryId`, `completedAt`, `attempts` — отсутствуют на бэкенде.

---

### 12. `PATCH /lessons/progress` — ❌ Отсутствует на фронте

**Бэкенд** принимает `ProgressProgressUpdateRequest`:

```json
{
  "lesson_slug": "string",
  "progress": "integer (0..100)"
}
```

Возвращает `UserLessonProgressOut`.

> 🔴 На фронте нет метода для обновления прогресса урока.

---

### 13. `PATCH /lessons/rating` — ❌ Отсутствует на фронте

**Бэкенд** принимает `UserUpdateRating`:

```json
{
  "id": "integer | null",
  "rating": "integer (≥0, default 0)"
}
```

Возвращает `User`.

> 🔴 На фронте нет метода для обновления рейтинга.

---

### 14. `POST /lessons/{id}/complete` — Только на фронте

**Фронтенд:** `completeLesson(lessonId)` → `POST /lessons/{lessonId}/complete`.

> ⚠️ Этот endpoint **не задокументирован** в Swagger бэкенда. Возможно, устарел или ещё не добавлен.

---

### 15. `GET /categories/{catId}/hp` — Только на фронте

**Фронтенд:** `getHp(catId)` → `GET /categories/{catId}/hp`.

Возвращает `HpStateExtended`:

```ts
{
  current: number
  max: number
  isDepleted: boolean
  restoredAt: string | null
}
```

> ⚠️ Этот endpoint **не задокументирован** в Swagger бэкенда. Возможно, ещё не реализован.

---

### 16. `POST /hp/hit` — Только на фронте

**Фронтенд:** `hitHp(categoryId)` → `POST /hp/hit` с body `{ categoryId }`.

Возвращает `HpHitResponse`:

```ts
{
  current: number
  max: number
  isDepleted: boolean
}
```

> ⚠️ Этот endpoint **не задокументирован** в Swagger бэкенда.

---

## Приоритетные задачи для синхронизации

### 🔴 Критические (блокируют работу с реальным API)

1. **Логин:** Переделать отправку с JSON на `application/x-www-form-urlencoded`, поле `email` → `username`.
2. **Регистрация:** Добавить поле `name` в `RegisterBody`.
3. **Категории:** Переделать тип `Category` — заменить `id` на `slug`, добавить `health` и `description`, убрать `progress`.
4. **Уроки:** Переделать тип `Lesson` — заменить `id` на `slug`, добавить `hit` и `category_slug`.
5. **Прогресс:** Изменить путь с `/progress` на `/lessons/me`, обновить тип.

### 🟡 Важные (новые endpoint'ы для реализации)

6. `GET /auth/current_user` — получение текущего пользователя.
7. `GET /categories/{slug}/progress` — прогресс по категории.
8. `GET /categories/game/progress` — общий игровой прогресс.
9. `PATCH /lessons/progress` — обновление прогресса урока.
10. `PATCH /lessons/rating` — обновление рейтинга.

### 🟠 Уточнить с бэкендером

11. `POST /auth/refresh` — не описан в Swagger, но используется.
12. `POST /lessons/{id}/complete` — есть на фронте, нет в Swagger.
13. `GET /categories/{catId}/hp` — есть на фронте, нет в Swagger.
14. `POST /hp/hit` — есть на фронте, нет в Swagger.
15. Опечатка `diffuculty` → `difficulty` в бэкенде — стоит исправить.
