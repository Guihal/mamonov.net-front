# AGENTS.md — mamonov.net-front

## Проект

Учебная платформа по кибербезопасности. Пользователь проходит уроки в формате симуляции рабочего стола ОС — открывает «программы» (браузер, почта, мессенджер), совершает действия, игровой контроллер фиксирует успех/провал. Название — **mamonov.net**.

## Стек

| Слой             | Технология                                                |
| ---------------- | --------------------------------------------------------- |
| Фреймворк        | Nuxt 4 (`nuxt ^4.4.2`, `vue ^3`)                          |
| Язык             | TypeScript                                                |
| Стили            | SCSS (глобальные функции/переменные через `globals.scss`) |
| Состояние        | Pinia + `useState`                                        |
| UI-библиотека    | `@nuxt/ui` v4 (UApp, UButton, UInput, UForm и т.д.)       |
| CSS-фреймворк    | Tailwind CSS v4                                           |
| Менеджер пакетов | pnpm                                                      |
| Линтинг          | ESLint (`@nuxt/eslint`)                                   |
| Форматтер        | Prettier                                                  |
| Утилиты          | `html-to-image` (скриншоты окон для превью в taskbar)     |

## Команды

```bash
pnpm install              # установка зависимостей
pnpm dev                  # dev-сервер
pnpm build                # production-сборка
pnpm lint                 # линтинг
pnpm typecheck            # проверка типов
```

## Роуты

| Роут                                          | Что делает                                   |
| --------------------------------------------- | -------------------------------------------- |
| `/`                                           | Главная, без запросов                        |
| `/app`                                        | Список категорий, GET /categories            |
| `/app/auth/login`                             | Форма логина                                 |
| `/app/auth/register`                          | Форма регистрации                            |
| `/app/categories`                             | Список категорий                             |
| `/app/categories/[categorySlug]`              | Уроки категории, GET /categories/:id/lessons |
| `/app/categories/[categorySlug]/[lessonSlug]` | Запускает OS в изолированном режиме          |

## Структура

```
shared/
└── types/
    ├── Program.d.ts    # ProgramType = 'browser' | 'mail' | 'messenger'
    ├── Entity.d.ts     # { name: string, programType: ProgramType, hidden?: boolean }
    └── FsFile.d.ts     # Entity & { path: string }

app/
├── app.vue             # точка входа (Nuxt UI: UApp → UHeader, UMain, UFooter)
├── app.config.ts       # тема Nuxt UI
├── layouts/
│   └── default.vue
├── types/
│   ├── game.ts         # GameStep, GameState, HpState и т.д.
│   ├── lesson.ts       # LessonConfig, LessonStep, EventType и т.д.
│   ├── mascot.ts       # MascotEmotion, MascotPhrase
│   └── programs.ts     # ProgramConfig, SiteEntry, MailEntry, ChatEntry и т.д.
├── stores/
│   ├── useUserStore.ts     # Pinia: HP, прогресс, isAuthed
│   └── useMockDbStore.ts   # Фейковая БД (уроки, категории, сайты, почта)
├── pages/
│   ├── index.vue                                      # главная
│   └── app/
│       ├── index.vue                                  # редирект / список категорий
│       ├── auth/
│       │   ├── login/index.vue + Form.vue
│       │   └── register/index.vue + Form.vue
│       └── categories/
│           ├── index.vue                              # список категорий
│           └── [categorySlug]/
│               ├── index.vue                          # уроки категории
│               └── [lessonSlug].vue                  # страница урока (OS-зона)
│
├── components/
│   ├── AppHeaderCenter.vue    # центральный блок хедера
│   ├── AppLogo.vue            # логотип
│   ├── LessonAlert.vue        # уведомления внутри урока
│   ├── Elephant/              # маскот-мамонтёнок
│   │   ├── index.vue
│   │   ├── Body.vue
│   │   ├── Cheeks.vue
│   │   ├── Eye.vue
│   │   ├── Eyes.vue
│   │   ├── Mouth.vue
│   │   └── SpeechBubble.vue
│   ├── GameOver/              # оверлей Game Over
│   │   ├── index.vue
│   │   ├── HpBar.vue
│   │   └── DepletedTimer.vue
│   └── OS/                   # вся система окон
│       ├── Window/
│       │   ├── index.vue               # компонент окна (фокус, bounds, fullscreen)
│       │   ├── View.vue                # TransitionGroup всех окон из allWindows
│       │   ├── Content.vue             # рендер программы по programType
│       │   ├── Window.d.ts             # WindowOb, WindowState, WindowStates, WindowFile
│       │   ├── _nav.scss
│       │   ├── composables/
│       │   │   ├── useCreateAndRegisterWindow.ts  # создать + зарегить окно в allWindows
│       │   │   ├── useCreateWindowByPath.ts       # создать окно по строковому пути
│       │   │   ├── useWindowLoading.ts            # состояние загрузки
│       │   │   ├── useCollapsed.ts                # сворачивание
│       │   │   ├── useOnFullScreen.ts             # полноэкранный режим
│       │   │   ├── useWindowFullscreenAutoSet.ts  # авто-fullscreen
│       │   │   ├── useSetFullscreenObserver.ts
│       │   │   ├── useSetFocusState.ts            # установка focused в states
│       │   │   ├── useSetLoadingState.ts
│       │   │   ├── useFocusOnClick.ts
│       │   │   ├── useIsInerractionWindow.ts
│       │   │   ├── useClampTargetOnResizeEnd.ts   # ограничение bounds при resize
│       │   │   ├── useResizeForDirections.ts      # направления resize (top/left/…)
│       │   │   ├── useResizeForDirectionsEvent.ts
│       │   │   └── useWindowLoop/                 # игровой цикл окна
│       │   ├── header/
│       │   │   ├── index.vue     # drag + кнопки навигации
│       │   │   ├── name.vue      # название окна
│       │   │   ├── nav/          # close, collapse, fullscreen кнопки
│       │   │   └── useMove.ts    # drag-and-drop
│       │   ├── resize/           # 9 resize-хендлов (All, Top, Bottom, Left, Right, углы)
│       │   └── utils/
│       │       ├── debounce.ts
│       │       ├── clampers.ts
│       │       ├── removeWindow.ts
│       │       ├── useGetId.ts
│       │       ├── setCalculatedBounds.ts
│       │       ├── setTargetBounds.ts
│       │       ├── setPath.ts, setSize.ts
│       │       ├── syncBounds.ts
│       │       ├── updateBoundsProp.ts, updateWindowBounds.ts, updateWindowWidth.ts
│       │       └── useRefBounds.ts
│       ├── Workbench/
│       │   ├── index.vue         # рабочий стол (фон, ярлыки)
│       │   └── Shortcut/         # ярлык на рабочем столе
│       ├── Programs/             # программы (контент окон)
│       │   ├── Browser/
│       │   │   ├── index.vue
│       │   │   ├── AddressBar.vue
│       │   │   ├── BookmarksBar.vue
│       │   │   ├── TabBar.vue
│       │   │   ├── PageView.vue
│       │   │   └── pages/        # встроенные страницы браузера
│       │   ├── Explorer/
│       │   │   ├── index.vue
│       │   │   ├── ExplorerBreadcrumbs.vue
│       │   │   ├── ExplorerSidebar.vue
│       │   │   ├── FileEntry.vue
│       │   │   └── FileGrid.vue
│       │   ├── Mail/
│       │   │   ├── index.vue
│       │   │   ├── MailList.vue
│       │   │   ├── MailMessage.vue
│       │   │   ├── MailSidebar.vue
│       │   │   ├── MailView.vue
│       │   │   └── MailAttachment.vue
│       │   └── Messenger/
│       │       ├── index.vue
│       │       ├── ChatHeader.vue
│       │       ├── ChatList.vue
│       │       ├── ChatListItem.vue
│       │       ├── ChatMessage.vue
│       │       ├── ChatView.vue
│       │       └── InputBar.vue
│       ├── QuickActions/
│       │   ├── index.vue         # панель быстрых действий (поверх OS)
│       │   ├── Menu.vue
│       │   └── ActionItem.vue
│       ├── Taskbar/
│       │   ├── index.vue               # таскбар: кнопка «Пуск» + AllPrograms
│       │   ├── AllPrograms.vue         # pinned + open программы
│       │   ├── StartMenu.vue           # меню «Пуск»: кнопка «Выйти»
│       │   ├── useScale.ts             # масштаб превью окон (MAX_SIZE=150px)
│       │   ├── useIsCurrentRoute.ts    # проверка активного маршрута по allWindows
│       │   └── Elements/
│       │       └── Program/
│       │           ├── index.vue       # кнопка программы в таскбаре
│       │           ├── AllFrames.vue   # список превью окон программы
│       │           └── Frame.vue       # превью одного окна (скриншот + закрыть)
│       ├── TaskbarTooltips.vue         # телепорт-контейнер всех тултипов таскбара
│       └── TaskbarTooltipItem.vue      # позиционированный тултип программы
│
├── composables/
│   ├── auth/
│   │   ├── useAuth.ts          # login(), register(), refresh()
│   │   ├── useLogin.ts
│   │   └── useRegister.ts
│   ├── user/
│   │   ├── useUser.ts          # обёртка над useUserStore
│   │   └── User.d.ts
│   ├── os/                     # composables программ и изоляции OS
│   │   ├── useOsIsolated.ts        # флаг изоляции роутера внутри урока
│   │   ├── useWindowRoute.ts       # синхронизация окна ↔ URL (с изоляцией)
│   │   ├── useBrowserBookmarks.ts  # закладки браузера
│   │   ├── useBrowserSites.ts      # реестр сайтов
│   │   ├── useBrowserTabs.ts       # вкладки браузера
│   │   ├── useExplorerState.ts     # состояние проводника
│   │   ├── useMailState.ts         # состояние почты
│   │   └── useMessengerState.ts    # состояние мессенджера
│   ├── game/
│   │   ├── useGameController.ts    # шаги, fail, complete
│   │   └── useGameOver.ts          # HP → 0, оверлей, перезапуск
│   ├── elephant/
│   │   └── useElephantMouse.ts     # отслеживание курсора для маскота
│   ├── mascot/
│   │   └── useMascotStore.ts       # эмоции, реплики маскота
│   │
│   # --- Глобальная OS (авто-импорт) ---
│   ├── useAllWindows.ts        # AllWindows = Record<string, WindowOb>; useState('windows_all')
│   ├── useBatchedReactive.ts   # Proxy + customRef: batched updates через queueMicrotask
│   ├── useContentArea.ts       # viewport − taskbarHeight = contentArea
│   ├── useFocusController.ts   # focusedWindowId; focus(id), unFocus()
│   ├── useGridCells.ts         # сетка ярлыков на рабочем столе
│   ├── useWindowBounds.ts      # getTargetBounds(id), getCalculatedBounds(id), removeWindowBounds(id)
│   ├── useWindowPaths.ts       # hasPath(path) → id | false
│   ├── useWindowTitle.ts       # label + name + title из FsFile через PROGRAMS
│   ├── useQueuedRouter.ts      # очередь router.push с дедупликацией
│   ├── useResizeObserver.ts    # обёртка ResizeObserver
│   ├── useFrameObserver.ts     # MutationObserver → html-to-image → images[id]
│   ├── useTaskbarTooltips.ts   # state тултипов: register/unregister/show/hide/cancelHide
│   ├── useWindowsGroupByProgram.ts  # группировка allWindows по programType (debounce 100ms)
│   └── usePinnedPrograms.ts    # pinnedPrograms: ProgramType[]; setPinnedPrograms(), clearPinnedPrograms()
│
├── utils/
│   ├── PROGRAMS.ts             # ProgramView { label, icon }; PROGRAMS[ProgramType]
│   ├── delay.ts
│   ├── getClickShortcutEvent.ts
│   ├── useIsMobile.ts
│   └── constants/
│       ├── PROGRAMS.ts         # конфиг программ (label, icon и т.д.)
│       ├── MASCOT_PHRASES.ts   # фразы маскота по эмоциям
│       └── OFFSET.ts           # отступы/константы позиционирования
│
├── lib/
│   ├── api.ts                  # $fetch с interceptor (401 → refresh → retry)
│   ├── api.methods.ts
│   └── api.types.ts            # Category, Lesson, HpState
│
├── mocks/
│   ├── MOCK_DATA.ts
│   ├── MOCK_USER.ts
│   ├── mockCategories.ts
│   ├── mockGetUser.ts
│   ├── mockHp.ts
│   ├── mockLessons.ts
│   ├── mockLogin.ts
│   ├── mockProgress.ts
│   └── mockRegister.ts
│
└── assets/
    ├── css/main.css
    └── scss/
        ├── globals.scss        # @forward vars, functions, mixins
        ├── vars.scss           # CSS-переменные / SCSS-переменные
        ├── functions.scss      # функция c()
        ├── mixins.scss
        ├── _settings.scss
        └── main.scss           # @use './settings'
```

## Ключевые типы

```ts
// shared/types/Program.d.ts
type ProgramType = 'browser' | 'mail' | 'messenger'

// shared/types/FsFile.d.ts
type FsFile = Entity & { path: string }

// Window.d.ts
type WindowOb = {
  id: string
  states: Partial<Record<WindowState, true>>
  targetFile: { value: string }
  file: FsFile | null
}

// useAllWindows.ts
type AllWindows = Record<string, WindowOb>

// useTaskbarTooltips.ts
type TooltipEntry = {
  programType: ProgramType
  containerBounds: DOMRect | null
  isShow: boolean
  windowObs: WindowOb[]
  container: HTMLElement | null
}
```

## Паттерны

### Создание окна

```ts
import { useCreateAndRegisterWindow } from '~/components/OS/Window/composables/useCreateAndRegisterWindow'
const file: FsFile = { name: 'Google', programType: 'browser', path: '/browser/google' }
useCreateAndRegisterWindow(file)
// или по строке:
useCreateAndRegisterWindow('/browser/google')
```

### Закреплённые программы (в конфиге урока)

```ts
const { setPinnedPrograms } = usePinnedPrograms()
setPinnedPrograms(['browser', 'mail']) // вызвать до монтирования OS
// clearPinnedPrograms() — при размонтировании
```

### Изоляция OS (внутри урока, чтобы OS не ломала Nuxt-роутер)

```ts
// composables/os/useOsIsolated.ts — реализовано
// В [lessonSlug].vue:
const { setIsolated } = useOsIsolated()
onMounted(() => setIsolated(true))
onUnmounted(() => setIsolated(false))
```

### Регистрация taskbar

```ts
// В корне страницы урока подключить OSTaskbar:
// <OSTaskbar /> — автоматически вызывает setViewportObserver + setTaskbarObserver
// <OSTaskbarTooltips /> — телепорт тултипов (ставить рядом с OSTaskbar)
// <OSWindowView /> — рендерит все окна из allWindows
```

## Соглашения

- **Авто-импорт**: все composables из `app/composables/` и компоненты из `app/components/` авто-импортируются Nuxt. Explicit import нужен только для файлов из `~/components/OS/Window/utils/` и типов. **Важно**: авто-импорт **не работает** для файлов во вложенных папках `composables/` и `utils/` (например `composables/elephant/`, `composables/mascot/`, `composables/auth/`). Для них нужен явный `import`.
- **Алиасы**: `~` → `app/`, `~~` → корень проекта (для `~~/shared/types/…`).
- **SCSS**: функция `c('colorName')` для цветов (из `globals.scss`). Всегда доступна в `<style lang="scss">`.
- **Стиль**: светлая тема (белый фон, чёрный текст). Без pixel-art бордеров. Используй Nuxt UI компоненты там, где возможно.
- **Состояние окон**: `states` — `Partial<Record<WindowState, true>>`. Наличие ключа = состояние активно. `delete states.focused` — снять состояние.
- **Bounds**: `getTargetBounds(id)` — реактивный (для CSS-переменных), `getCalculatedBounds(id)` — plain object (для вычислений). Не путать.
- **ProgramType**: `'browser' | 'mail' | 'messenger'` — на этом проекте. Не копировать из portfolio-new (`explorer`, `project`, `tproject`).

## Auth flow

```
lib/api.ts → $fetch с credentials: 'include'
  onResponseError: 401/403 → POST /auth/refresh
    success → retry
    fail    → navigateTo('/app/auth/login')

middleware/auth.ts → проверяет useUser().isAuthed
  пропускает /app/auth/**
  остальное /app/** → редирект на login
```

## Изоляция OS

OS синхронизирует URL окна через `router.push`. Внутри урока это сломает навигацию Nuxt. Решение — `useOsIsolated` (реализовано в `composables/os/useOsIsolated.ts`). Логика синхронизации — в `composables/os/useWindowRoute.ts`.

## Задачи (docs/tasks/)

Не используй Субагентов (вообще!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!)
Все задачи пронумерованы `1.N`. Статусы: `⬜ Не выполнено`, `✅ Выполнено`.

| Задача | Файл                    | Описание                                 |
| ------ | ----------------------- | ---------------------------------------- |
| 1.1    | 1.1-window.md           | ✅ Перенос Window                        |
| 1.2    | 1.2-taskbar.md          | ✅ Перенос Taskbar + StartMenu + Pinned  |
| 1.3    | 1.3-workbench.md        | ✅ Перенос Workbench                     |
| 1.4    | 1.4-explorer.md         | ✅ Создание программы Explorer           |
| 1.5    | 1.5-colors.md           | ✅ Цветовая схема                        |
| 1.6    | 1.6-types.md            | ✅ Типы (lesson.ts, programs.ts)         |
| 1.7    | 1.7-browser.md          | ✅ Программа Browser                     |
| 1.8    | 1.8-mail.md             | ✅ Программа Mail                        |
| 1.9    | 1.9-messenger.md        | ✅ Программа Messenger                   |
| 1.10   | 1.10-auth-forms.md      | ✅ Auth формы                            |
| 1.11   | 1.11-os-isolated.md     | ✅ useOsIsolated                         |
| 1.12a  | 1.12-window-file.md     | ✅ FsFile → Window                       |
| 1.12b  | 1.12-window-route.md    | ✅ useWindowRoute (изоляция)             |
| 1.13   | 1.13-game-controller.md | ✅ gameController (шаги, fail, complete) |
| 1.14   | 1.14-game-over.md       | ✅ Game Over (HP, overlay, перезапуск)   |
| 1.15   | 1.15-lesson-page.md     | ✅ Страница урока (OS-зона, Alert)       |
| 1.16   | 1.16-elephant.md        | ✅ Маскот-мамонтёнок                     |
| 1.17   | 1.17-comic.md           | ⬜ Comic (первый вход)                   |
| 1.18   | 1.18-test-lesson.md     | ⬜ Тестовый урок phishing-intro          |
| 1.19   | 1.19-user-store.md      | ✅ useUserStore (HP, прогресс)           |
| 1.20   | 1.20-mascot-store.md    | ✅ useMascotStore (эмоции, реплики)      |
| 1.21   | 1.21-check-flow.md      | ⬜ Проверка полного flow                 |
| 1.22   | 1.22-quick-actions.md   | ✅ Quick Actions (панель действий)       |
| 1.23   | 1.23-persist-store.md   | ✅ Persist Store (фейковая БД)           |
| 1.24   | 1.24-categories-page.md | ⬜ Страница категорий и уроков           |
