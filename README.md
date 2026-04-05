# mamonov.net

Учебная платформа по кибербезопасности. Пользователь проходит интерактивные уроки в формате симуляции рабочего стола ОС — открывает «программы» (браузер, почту, мессенджер), совершает действия, а игровой контроллер фиксирует успех или провал.

## Стек

| Слой             | Технология             |
| ---------------- | ---------------------- |
| Фреймворк        | Nuxt 4 / Vue 3         |
| Язык             | TypeScript             |
| Стили            | SCSS + Tailwind CSS v4 |
| Состояние        | Pinia                  |
| UI-библиотека    | Nuxt UI v4             |
| Менеджер пакетов | pnpm                   |
| Линтинг          | ESLint + Prettier      |

## Уроки

Платформа включает уроки по трём тематикам:

| Категория | Уроки                                                                           |
| --------- | ------------------------------------------------------------------------------- |
| Дом       | `home-fake-update`, `home-weak-password`, `home-wifi-security`                  |
| Офис      | `office-phishing-email`, `office-phishing-message`, `office-social-engineering` |
| Wi-Fi     | `wifi-captive-portal`, `wifi-evil-twin`, `wifi-traffic-sniff`                   |

Каждый урок — это набор шагов с конфигурацией программ (браузер, почта, мессенджер), действий пользователя и реакций игрового контроллера.

## Симуляция ОС

Ядро платформы — полноценная симуляция рабочего стола операционной системы, написанная на Vue 3. Пользователь взаимодействует с «компьютером»: открывает программы, переключается между окнами, работает с файлами — и в процессе учится распознавать угрозы.

### Оконный менеджер

Каждое окно (`WindowOb`) — это реактивный объект с собственным id, набором состояний и привязкой к файлу:

```ts
type WindowState =
  | 'fullscreen'
  | 'collapsed'
  | 'drag'
  | 'resize'
  | 'loading'
  | 'error'
  | 'focused'
  | 'preview'

type WindowOb = {
  id: string
  states: Partial<Record<WindowState, true>> // наличие ключа = состояние активно
  targetFile: { value: string }
  file: FsFile | null
}
```

Все открытые окна хранятся в `allWindows: Record<string, WindowOb>` (глобальный `useState`). Оконный менеджер поддерживает:

- **Drag & Drop** — перетаскивание окон за заголовок
- **Resize** — изменение размера с 8 направлений (углы + стороны)
- **Fullscreen** — разворот на весь экран с анимацией
- **Collapse** — сворачивание в таскбар
- **Focus** — z-order окон, фокус по клику
- **Bounds** — два слоя: `targetBounds` (реактивный, для CSS-переменных) и `calculatedBounds` (plain object, для вычислений)

### Программы

Окна рендерят контент по типу программы (`ProgramType`):

| Программа   | Описание                                                                                                        |
| ----------- | --------------------------------------------------------------------------------------------------------------- |
| `browser`   | Встроенный браузер с адресной строкой, вкладками, закладками и рендерингом Vue-компонентов как «страниц сайтов» |
| `mail`      | Почтовый клиент с папками, списком писем, просмотром сообщений и вложениями                                     |
| `messenger` | Мессенджер с чатами, аватарами, историей сообщений и полем ввода                                                |
| `explorer`  | Файловый проводник с деревом папок и файлами                                                                    |
| `vpn`       | VPN-клиент для уроков по Wi-Fi безопасности                                                                     |

Каждая программа — ленивый `defineAsyncComponent`, загружается только при открытии окна.

### Таскбар

Нижняя панель ОС: кнопка «Пуск», закреплённые (pinned) программы и индикаторы открытых окон. При наведении на иконку показывается тултип-превью окна, сгенерированный через `html-to-image`.

### Рабочий стол (Workbench)

Ярлыки программ на фоне рабочего стола, расположенные по сетке (`useGridCells`). Двойной клик — открытие окна.

### Изоляция OS

Внутри урока ОС работает в изолированном режиме (`useOsIsolated`). Это предотвращает конфликт синхронизации URL окон с Nuxt-роутером — OS «думает», что управляет адресной строкой, но на самом деле внутренняя навигация не ломает `/app/categories/[slug]/[lesson]`.

## Конфигурация уроков

Каждый урок описывается объектом `LessonConfig` — декларативный конфиг, который полностью определяет поведение ОС и игровую логику:

```ts
interface LessonConfig {
  id: string
  categoryId: string
  programs: ProgramType[] // какие программы доступны
  openOnStart?: ProgramType[] // какие открыть сразу
  startPaths?: Record<ProgramType, string> // стартовые URL/пути

  // Контент программ
  browserSites?: BrowserSiteConfig[] // сайты (Vue-компоненты)
  browserBookmarks?: BookmarkConfig[] // закладки
  messengerChats?: ChatConfig[] // чаты с сообщениями
  mailEmails?: EmailConfig[] // письма
  mailFolders?: MailFolder[] // папки почты
  wifiConfig?: WifiConfig // Wi-Fi сети

  // Игровая логика
  events?: LessonEvents // обработчики действий пользователя
  quickActions?: QuickAction[] // кнопки быстрых действий
  mascotPhrases?: Record<string, string> // реплики маскота
}
```

### Событийная модель

Конфиг описывает колбэки на действия пользователя. Первый аргумент — `GameControllerContext`:

```ts
events: {
  browser: {
    onUrlNavigate: (ctrl, url) => { /* ... */ },
    onFormSubmit: (ctrl, url, data) => { /* ... */ },
  },
  mail: {
    onAttachmentOpen: (ctrl, emailId, attachmentId) => {
      ctrl.fail('Открыл вредоносное вложение')
    },
    onLinkClick: (ctrl, emailId, url) => { /* ... */ },
  },
  messenger: {
    onLinkClick: (ctrl, chatId, url) => { /* ... */ },
  }
}
```

### Игровой контроллер

`useGameController` — центральный composable урока. Управляет шагами, фиксирует ошибки, завершает урок:

- `nextStep()` / `goToStep(n)` — переход между шагами
- `fail(reason)` — пользователь ошибся, HP снижается
- `complete()` — урок пройден
- `openBrowserTab(url)` — открыть вкладку программно
- `messengerPushMessage(chatId, msg)` — NPC отправляет сообщение
- `wifiConnect(id)` / `wifiDisconnect()` — управление Wi-Fi
- `reset()` — полный сброс для кнопки «Попробовать снова»

Контроллер пробрасывается через `provide/inject` — любой компонент внутри урока может получить доступ через `inject(GAME_CONTROLLER_KEY)`.

### Маскот

Мамонтёнок-помощник с эмоциями (`happy`, `sad`, `worried`, `neutral`) и очередью реплик. Конфиг урока задаёт фразы маскота для каждого шага и реакции на ошибки. Маскот следит за курсором через `useElephantMouse`.

## Установка

```bash
pnpm install
```

## Разработка

Запуск dev-сервера на `http://localhost:3000`:

```bash
pnpm dev
```

Бэкенд API проксируется на `http://localhost:8080` через Nitro devProxy.

## Скрипты

```bash
pnpm dev          # dev-сервер
pnpm build        # production-сборка
pnpm preview      # превью production-сборки
pnpm lint         # линтинг
pnpm typecheck    # проверка типов
```

## Переменные окружения

| Переменная                  | Описание                       | По умолчанию            |
| --------------------------- | ------------------------------ | ----------------------- |
| `NUXT_API_BASE_URL`         | URL бэкенд API                 | `http://localhost:8080` |
| `NUXT_PUBLIC_IS_BATTLE_API` | Флаг использования боевого API | —                       |

## Docker

```bash
docker compose up --build
```

Контейнер слушает порт `3000`. Переменные передаются через `.env` или аргументы `docker compose`.

## Структура проекта

```
app/
├── components/        # Vue-компоненты (авто-импорт)
│   └── OS/            # Симуляция ОС: окна, таскбар, рабочий стол, программы
├── composables/       # Composables (авто-импорт из корня)
├── layouts/           # Nuxt layouts
├── lessons/           # Конфигурации уроков
├── lib/               # API-клиент ($fetch + refresh-токен)
├── mocks/             # Моковые данные для офлайн-режима
├── pages/             # Nuxt-страницы (file-based routing)
├── stores/            # Pinia-сторы
├── types/             # TypeScript-типы
└── utils/             # Утилиты и константы
shared/
└── types/             # Общие типы (ProgramType, FsFile, Entity)
docs/                  # Документация и задачи
```

## Лицензия

MIT
