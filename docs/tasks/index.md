# Задачи: Интеграция OS в МАМОНТОВ.net

> Учебная платформа по кибербезопасности. Модули: Офис, Дом, Публичная сеть и т.д. По 3 урока на модуль. OS симулирует рабочий стол, программы (браузер, почта, мессенджер) расширяются данными и ивентами каждого урока.

## Сводная таблица

| Задача | Название                                | Статус | Файл                                                     |
| ------ | --------------------------------------- | ------ | -------------------------------------------------------- |
| 1.1    | Перенос Window                          | ✅     | [1.1-window.md](tasks/1.1-window.md)                     |
| 1.2    | Перенос Taskbar                         | ✅     | [1.2-taskbar.md](tasks/1.2-taskbar.md)                   |
| 1.3    | Перенос Workbench                       | ✅     | [1.3-workbench.md](tasks/1.3-workbench.md)               |
| 1.4    | Explorer (Finder-like, файлы урока)     | ✅     | [1.4-explorer.md](tasks/1.4-explorer.md)                 |
| 1.5    | Цвета: macOS light + Figma              | ✅     | [1.5-colors.md](tasks/1.5-colors.md)                     |
| 1.6    | Типы: LessonConfig, программы, ивенты   | ✅     | [1.6-types.md](tasks/1.6-types.md)                       |
| 1.7    | Browser: вкладки, реестр сайтов, iframe | ✅     | [1.7-browser.md](tasks/1.7-browser.md)                   |
| 1.8    | Mail: почта, вложения, фишинг           | ✅     | [1.8-mail.md](tasks/1.8-mail.md)                         |
| 1.9    | Messenger: Telegram-like, чаты          | ✅     | [1.9-messenger.md](tasks/1.9-messenger.md)               |
| 1.10   | Auth формы (Nuxt UI)                    | ✅     | [1.10-auth-forms.md](tasks/1.10-auth-forms.md)           |
| 1.11   | useOsIsolated                           | ✅     | [1.11-os-isolated.md](tasks/1.11-os-isolated.md)         |
| 1.12a  | FsFile → Window                         | ✅     | [1.12-window-file.md](tasks/1.12-window-file.md)         |
| 1.12b  | useWindowRoute (изоляция)               | ✅     | [1.12-window-route.md](tasks/1.12-window-route.md)       |
| 1.13   | gameController (шаги, fail, complete)   | ✅     | [1.13-game-controller.md](tasks/1.13-game-controller.md) |
| 1.14   | Game Over (HP, overlay, перезапуск)     | ✅     | [1.14-game-over.md](tasks/1.14-game-over.md)             |
| 1.15   | Страница урока (OS-зона, Alert)         | ✅     | [1.15-lesson-page.md](tasks/1.15-lesson-page.md)         |
| 1.16   | Маскот-мамонтёнок                       | ✅     | [1.16-elephant.md](tasks/1.16-elephant.md)               |
| 1.17   | Comic (первый вход)                     | ⬜     | [1.17-comic.md](tasks/1.17-comic.md)                     |
| 1.18   | Тестовый урок phishing-intro            | ⬜     | [1.18-test-lesson.md](tasks/1.18-test-lesson.md)         |
| 1.19   | useUserStore (HP, прогресс)             | ✅     | [1.19-user-store.md](tasks/1.19-user-store.md)           |
| 1.20   | useMascotStore (эмоции, реплики)        | ✅     | [1.20-mascot-store.md](tasks/1.20-mascot-store.md)       |
| 1.21   | Проверка полного flow                   | ⬜     | [1.21-check-flow.md](tasks/1.21-check-flow.md)           |
| 1.22   | Quick Actions (панель действий)         | ✅     | [1.22-quick-actions.md](tasks/1.22-quick-actions.md)     |
| 1.23   | Persist Store (фейковая БД)             | ✅     | [1.23-persist-store.md](tasks/1.23-persist-store.md)     |
| 1.24   | Страница категорий и уроков             | ⬜     | [1.24-categories-page.md](tasks/1.24-categories-page.md) |

## Уроки

Идеи уроков (по 3 на категорию, 9 штук): [docs/lessons/](../lessons/)

| Категория          | Урок 1               | Урок 2                   | Урок 3                       |
| ------------------ | -------------------- | ------------------------ | ---------------------------- |
| Офис               | Фишинг в мессенджере | Фишинговое письмо        | Социальная инженерия         |
| Дом                | Слабый пароль        | Фейковое обновление      | Безопасность домашнего Wi-Fi |
| Общественный Wi-Fi | Перехват трафика     | Поддельная точка доступа | Фейковый портал авторизации  |

## Прогресс

**Всего задач**: 25
**Выполнено**: 20
**В работе**: 0
**Осталось**: 5

## Рекомендованный порядок

1. **1.5** Цвета → **1.6** Типы → **1.12a** FsFile → **1.12b** Route
2. **1.1** Window → **1.2** Taskbar → **1.3** Workbench → **1.4** Explorer
3. **1.11** Изоляция
4. **1.7** Browser → **1.8** Mail → **1.9** Messenger
5. **1.19** UserStore → **1.20** MascotStore
6. **1.13** GameController → **1.14** GameOver → **1.22** QuickActions
7. **1.16** Маскот → **1.10** Auth → **1.17** Comic (комикс игнорируем)
8. **1.23** Persist Store → **1.24** Страница категорий
9. **1.15** Страница урока → **1.18** Тестовый урок → **1.21** Проверка flow
