# МАМОНТОВ.net — архитектура проекта

## Стек

- Nuxt 3 + TypeScript
- Pinia
- SCSS

---

## Структура папок

```
pages/
  index.vue                          # главная, 0 запросов
  app/
    index.vue                        # список категорий
    auth/
      login/
        index.vue                    # страница логина
        Form.vue                     # форма логина
      register/
        index.vue                    # страница регистрации
        Form.vue                     # форма регистрации
    [category]/
      index.vue                      # уроки категории
      [lesson]/
        index.vue                    # точка входа урока (OS + GameController)

components/
  ui/                                # общие переиспользуемые компоненты
    Button.vue
    Input.vue
  OS/                                # система окон (перенос из портфолио)
    Window/
    Taskbar/
    ...
  Elephant/                          # маскот-слоник
    index.vue                        # корень: position fixed, bottom+right, translate от store
    Eyes.vue                         # глазки следят за мышью
    Body.vue
    composables/
      useElephantMouse.ts            # вешает mousemove на window, пишет в store
    stores/
      useElephantStore.ts            # useBatchedReactive({ mouseX, mouseY })
  Comic/
    index.vue                        # слайдшоу картинок перед уроком

lessons/                             # захардкоженные конфиги уроков
  phishing-intro/
    config.ts                        # LessonConfig
    events.ts                        # специфичные евенты урока

composables/
  auth/
    useAuth.ts                       # login(), register(), refresh()
  game/
    useGameController.ts             # основной контроллер игры
    useGameOver.ts                   # геймовер, вызов /hp/hit
    useOsIsolated.ts                 # флаг изоляции OS от Nuxt-роутера
  os/
    useWindowRoute.ts                # патч: не вызывает queuedPush если isIsolated

stores/
  useUserStore.ts                    # hp, isDepleted, syncHp()
  useMascotStore.ts                  # реплики слоника, текущая эмоция

utils/
  debounce.ts
  math.ts                            # getMousePercent(x, y) → { x: 0..1, y: 0..1 }

types/
  lesson.ts                          # LessonConfig, ComicSlide
  programs.ts                        # BaseProgramEvents, MessengerEvents, MailEvents, BrowserEvents

lib/
  api.ts                             # $fetch.create с interceptor (401 → refresh → retry)
```

---

## Роуты и их ответственность

| Роут                       | Что делает                                   |
| -------------------------- | -------------------------------------------- |
| `/`                        | Главная, без запросов                        |
| `/app`                     | Список категорий, GET /categories            |
| `/app/auth/login`          | Форма логина, POST /auth/login               |
| `/app/auth/register`       | Форма регистрации, POST /auth/register       |
| `/app/[category]`          | Уроки категории, GET /categories/:id/lessons |
| `/app/[category]/[lesson]` | Запускает OS в изолированном режиме          |

---

## Auth flow

```
lib/api.ts
  $fetch.create
    credentials: 'include'           # httpOnly куки шлются авто
    onResponseError:
      401/403 → POST /auth/refresh
        success → retry оригинального запроса
        fail    → navigateTo('/app/auth/login')

composables/auth/useAuth.ts
  login(email, password)   → POST /auth/login
  register(email, password)→ POST /auth/register
  refresh()                → POST /auth/refresh → { success: bool }

middleware/auth.ts
  применяется к /app/**
  пропускает /app/auth/**
  проверяет store.isAuthed (Pinia)
  если нет → navigateTo('/app/auth/login')
```

---

## Изоляция OS внутри урока

OS из портфолио использует `router.push` для синхронизации пути окна с URL.
Внутри урока это сломает навигацию — поэтому вводится флаг изоляции.

```ts
// composables/game/useOsIsolated.ts
const isIsolated = ref(false);
export const useOsIsolated = () => ({
  isIsolated,
  setIsolated: (v: boolean) => {
    isIsolated.value = v;
  },
});

// В useWindowRoute.ts — добавить одну проверку:
if (!isIsolated.value) queuedPush(path);

// В pages/app/[category]/[lesson]/index.vue:
const { setIsolated } = useOsIsolated();
onMounted(() => setIsolated(true));
onUnmounted(() => setIsolated(false));
```

---

## Типы

### LessonConfig

```ts
// types/lesson.ts
interface ComicSlide {
  src: string              # путь к картинке
}

interface LessonConfig {
  id: string
  categoryId: string
  comic: ComicSlide[]      # слайды перед уроком
  programs: ProgramConfig[]
  events: BaseProgramEvents
}
```

### Программы и евенты

```ts
// types/programs.ts

// Общие евенты для всех программ
interface BaseProgramEvents {
  onUrlNavigate?: (url: string) => void;
  onFileDownload?: (filename: string) => void;
  onMalwareRun?: (name: string) => void;
}

// Расширения под конкретные программы
interface MessengerEvents extends BaseProgramEvents {
  onMessageSend?: (to: string, text: string) => void;
}

interface MailEvents extends BaseProgramEvents {
  onMailOpen?: (mailId: string) => void;
  onAttachmentOpen?: (filename: string) => void;
}

interface BrowserEvents extends BaseProgramEvents {
  onFormSubmit?: (fields: Record<string, string>) => void;
}
```

---

## GameController

```ts
// composables/game/useGameController.ts
const useGameController = (config: LessonConfig) => {
  const step = ref(0);
  const { triggerGameOver } = useGameOver();
  const { say } = useMascotStore();

  const nextStep = () => {
    step.value++;
  };
  const fail = (reason: string) => triggerGameOver(reason);

  provide("gameController", { step, nextStep, fail, config });
};
```

Евенты из `LessonConfig` вызывают `nextStep()` или `fail()` в зависимости от действия.
Каждый урок расширяет `BaseProgramEvents` своими специфичными обработчиками.

---

## Маскот (Слоник)

```
Elephant/
  index.vue
    position: fixed; bottom: 0; right: 0      # статично
    translate: v-bind(translateX) v-bind(translateY)  # только translate анимируется
    will-change: translate

  stores/useElephantStore.ts
    useBatchedReactive({ mouseX: 0, mouseY: 0 })
    # batching через queueMicrotask — один апдейт за тик

  composables/useElephantMouse.ts
    window.addEventListener('mousemove', ...)
    store.mouseX = e.clientX / window.innerWidth   # 0..1
    store.mouseY = e.clientY / window.innerHeight

  Eyes.vue
    translate от mouseX/mouseY → глазки следят

  utils/math.ts
    getMousePercent(x, y) → { x: 0..1, y: 0..1 }
```

Чем ближе мышь к правому нижнему углу (где стоит слоник) → тем больше translateX/Y → слоник прячется за край.

Вызов `useElephantMouse` — в `pages/app/[category]/[lesson]/index.vue`:

```ts
const { start, stop } = useElephantMouse();
onMounted(start);
onUnmounted(stop);
```

---

## Flow одного урока

```
[lesson]/index.vue монтируется
  ↓
setIsolated(true)             # OS не трогает Nuxt-роутер
useElephantMouse.start()      # слоник начинает следить за мышью
  ↓
Comic/index.vue               # слайдшоу картинок из config.comic
  ↓ (пользователь прошел комикс)
OS запускается                # открывается нужное окно через componentSlug
useGameController(config)     # инжектится в компоненты
  ↓
Пользователь взаимодействует с программами
  ↓
events вызывают nextStep() или fail()
  ↓
fail() → useGameOver()        # POST /hp/hit, показ экрана проигрыша
nextStep() → следующий шаг   # или конец урока → POST /lessons/:id/complete
```

---

## Порядок реализации

1. `lib/api.ts` + `composables/auth/useAuth.ts`
2. `middleware/auth.ts`
3. Страницы auth: login, register
4. `pages/app/index.vue` — категории
5. `pages/app/[category]/index.vue` — уроки
6. `types/lesson.ts` + `types/programs.ts`
7. `useGameController` + `useGameOver`
8. Перенос OS в `components/OS/`
9. `useOsIsolated` + патч `useWindowRoute`
10. `[lesson]/index.vue` — Comic → OS flow
11. `Elephant/` — маскот
12. Первый тестовый урок
