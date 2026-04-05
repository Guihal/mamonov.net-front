# МАМОНТОВ.net — описание проекта

## Суть проекта

Образовательная платформа в виде настольной ОС. Пользователь проходит уроки по кибербезопасности, взаимодействуя с программами внутри оконной системы (проводник, браузер, почта, мессенджер).

## Стек

- **Nuxt 3** (v4) + TypeScript
- **Nuxt UI v4** — компонентная база (формы, кнопки, карточки, навигация)
- **Pinia** — стейт-менеджмент
- **Tailwind CSS v4** — стилизация
- **SCSS** — дополнительные глобальные стили

## Архитектура

### Два "режима" приложения

1. **Сайт (Nuxt-роутинг)** — обычные страницы:
   - `/` — лендинг
   - `/app` — список категорий
   - `/app/auth/login` — логин
   - `/app/auth/register` — регистрация
   - `/app/[category]` — список уроков
   - `/app/[category]/[lesson]` — **точка входа в OS**

2. **OS (внутри урока)** — оконная система:
   - Taskbar (нижняя панель)
   - Workbench (рабочий стол)
   - Windows (перетаскиваемые, ресайзящиеся окна)
   - Programs (контент внутри окон)

### Ключевое правило

**OS изолирована** от Nuxt-роутера. Внутри урока `router.push` не должен вызывать навигацию Nuxt. Флаг `isIsolated` контролирует это. Окна открываются через `FsFile` объекты, а не через URL-роутинг.

## Flow пользователя

```
Главная (/) → Логин/Регистрация → Категории (/app)
  → Уроки категории → Выбор урока → Comic (слайды)
    → OS с программами → Взаимодействие → nextStep/fail
      → Конец урока или Game Over
```

## Авторизация

- `httpOnly` куки
- `POST /auth/login` → логин
- `POST /auth/register` → регистрация
- `POST /auth/refresh` → обновление токена
- Interceptor в `lib/api.ts`: 401 → refresh → retry
- Middleware на `/app/**` (кроме `/app/auth/**`)

## Цветовая схема

- **Фон**: белый (`#ffffff`)
- **Текст**: чёрный (`#000000`)
- Nuxt UI компоненты настраиваются через `app.config.ts`
- Стиль — современный, без pixel-art / pixel-box

## Типы программ

Каждая программа — Vue компонент с собственным интерфейсом событий.

### 1. Проводник (Explorer)

- Файловая система
- Ивенты: `onFileDownload`, `onMalwareRun`

### 2. Браузер (Browser)

- Веб-страницы, фишинговые формы
- Ивенты: `onUrlNavigate`, `onFormSubmit`

### 3. Почта (Mail)

- Письма, вложения
- Ивенты: `onMailOpen`, `onAttachmentOpen`

### 4. Мессенджер (Messenger)

- Чат с "противником"
- Ивенты: `onMessageSend`

## LessonConfig

Каждый урок описывает конфигурацию:

```ts
interface LessonConfig {
  id: string
  categoryId: string
  comic: ComicSlide[] // слайды перед уроком
  programs: ProgramConfig[] // какие программы открыты
  events: BaseProgramEvents // обработчики
}
```

## GameController

```ts
const useGameController = (config: LessonConfig) => {
  const step = ref(0)
  const nextStep = () => {
    step.value++
  }
  const fail = (reason: string) => {
    /* POST /hp/hit */
  }
}
```

- Инжектится через `provide/inject`
- Программы вызывают `nextStep()` при правильных действиях
- `fail()` → экран проигрыша

## Маскот (Слоник)

- Компонент `Elephant/` — fixed, bottom-right
- Глаза следят за мышью (`useElephantMouse`)
- Прячется при приближении курсора
- Вызывается только внутри урока

## Структура проекта

```
mamonov.net-front/
  app/
    pages/
      index.vue                    # лендинг
      app/
        index.vue                  # категории
        auth/
          login/index.vue          # логин
          register/index.vue       # регистрация
        [category]/index.vue       # уроки
        [category]/[lesson]/index.vue  # OS + Comic
    components/
      OS/                          # оконная система
        Window/                    # компонент окна
        Taskbar/                   # нижняя панель
        Workbench/                 # рабочий стол
        Programs/                  # программы
          Explorer/
          Browser/
          Mail/
          Messenger/
      Elephant/                    # маскот
      Comic/                       # слайдшоу
      ui/                          # общие UI компоненты
    composables/
      auth/useAuth.ts              # login, register
      game/useGameController.ts    # контроллер игры
      game/useGameOver.ts          # game over логика
      os/useOsIsolated.ts        # флаг изоляции
    types/
      window.ts                  # FsFile, Entity, ProgramType
    stores/
      useUserStore.ts              # hp, auth
      useMascotStore.ts            # реплики слоника
      useElephantStore.ts          # позиция мыши
    lib/
      api.ts                       # $fetch с interceptors
    types/
      lesson.ts                    # LessonConfig, ComicSlide
      programs.ts                  # *Events интерфейсы
    middleware/
      auth.ts                      # проверка авторизации
```

## Важные ограничения

1. **НЕ трогать готовые модули** нового сайта (категории, auth ручки, API)
2. **Стиль — Nuxt UI v4**, без pixel-box
3. **Цвета** — белый фон, чёрный текст (включая Nuxt UI компоненты)
4. **OS открывается только после выбора урока** (через Comic)
5. Изоляция OS от Nuxt-роутера обязательна
