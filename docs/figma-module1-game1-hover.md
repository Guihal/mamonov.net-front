# Figma: Модуль 1. Игра 1 при наведении — стили элементов

> Синхронизировано с Figma. Два варианта фрейма:
>
> - **Фрейм A** (`370:1269`) — начальное состояние (без сообщения в чате)
> - **Фрейм B** (`370:1551`) — при наведении / активное состояние (сообщение в чате)
>
> Размер обоих фреймов: `1440 × 847px`. Фон страницы: `#f1f1f1`.

---

## 1. Фон (Background)

| Слой          | Тип            | Значение                                                                                     |
| ------------- | -------------- | -------------------------------------------------------------------------------------------- |
| `image 47`    | Изображение    | Фоновый скриншот, `object-fit: fill`, `border-radius: 20px`, размер `1440×847px`             |
| `Rectangle 2` | Верхняя полоса | Высота `33px`, `border-radius: 4px`, градиент `linear` `#c4c4c466 → #c4c4c466` (сверху вниз) |

---

## 2. Mac Menu Bar (верхняя системная панель)

Позиция: `top: 0`, высота `33px`.

| Элемент                      | Размер    | Позиция (от левого края) |
| ---------------------------- | --------- | ------------------------ |
| `icons8_apple_logo_24px 1`   | `24×21px` | `~16px` от левого края   |
| `image 50` (часы / Siri)     | `26×27px` | правый блок              |
| `icons8_speaker_24px 1`      | `24×24px` | правый блок              |
| `icons8_wi-fi_24px 1`        | `20×21px` | правый блок              |
| `icons8_full_battery_24px 1` | `29×25px` | правый блок, крайний     |

---

## 3. Header (навигация сайта)

Компонент `Header` (Nuxt UI). Позиция: `position: absolute; top: 4px; left: 0; width: 100%`.

```
width: 1440px
height: 64px
stroke: #e2e8f0 (border-bottom)
```

### 3.1 Логотип `Мамонтов.нет`

Группа `Group 7` — три текстовых части в строку:

| Часть      | Шрифт   | Размер | Вес | Цвет      | Letter-spacing | Line-height |
| ---------- | ------- | ------ | --- | --------- | -------------- | ----------- |
| `Мамонтов` | DM Sans | 40px   | 500 | `#000000` | `-2.8px`       | `74px`      |
| `.`        | DM Sans | 40px   | 500 | `#000000` | `-2.8px`       | `74px`      |
| `нет`      | DM Sans | 40px   | 500 | `#a57ce9` | `-2.8px`       | `74px`      |

> Цвет акцента `.нет` — **фиолетовый `#a57ce9`**.

### 3.2 Название сайта в Header-компоненте

| Элемент       | Шрифт   | Размер | Вес | Текст          |
| ------------- | ------- | ------ | --- | -------------- |
| `Nuxt UI Pro` | DM Sans | 18px   | 700 | `Мамонтов.нет` |

---

## 4. Chrome Desktop (окно браузера)

```
background: #ffffff
border-radius: 10px
width: 1048px
height: 526px
position: absolute; top: ~116px; left: ~266px
```

### 4.1 Chrome Tab Bar

```
background: #dfe1e5
height: 36px
border-bottom: 1px solid #dadce0
```

**Светофор (Mac traffic lights):**

| Кнопка       | Fill      | Stroke    | Размер                          |
| ------------ | --------- | --------- | ------------------------------- |
| Mac Close    | `#ee6b5f` | `#e93f30` | `11×11px`, `border-radius: 50%` |
| Mac Minimize | `#f5be50` | `#f2ad21` | `11×11px`, `border-radius: 50%` |
| Mac Expand   | `#62c655` | `#47ac3a` | `11×11px`, `border-radius: 50%` |

**Активная вкладка (`Tab`):**

```
background: #ffffff
border-radius: 6px
width: ~220px
height: 30px
```

Текст вкладки `Рабочий чатик`:

```
font-family: Roboto
font-weight: 500
font-size: 10px
color: #3d4043
```

### 4.2 Адресная строка и Bookmarks (Frame 5)

**Google Apps icon** (`Apps`) — 3×3 цветная сетка квадратов, размер `10.5×10.5px`:

| Позиция в сетке | Цвет      |
| --------------- | --------- |
| [0,0]           | `#e34a3e` |
| [1,0]           | `#e34a3e` |
| [2,0]           | `#e34a3e` |
| [0,1]           | `#529a60` |
| [1,1]           | `#418bec` |
| [2,1]           | `#e5a439` |
| [0,2]           | `#529a60` |
| [1,2]           | `#e5a439` |
| [2,2]           | `#e5a439` |

**Закладки (только Фрейм B):**

| Закладка        | Иконка                     |
| --------------- | -------------------------- |
| URLScan         | Кастомная иконка (favicon) |
| Inspirations    | Кастомная иконка           |
| Work            | Кастомная иконка           |
| Memes           | Кастомная иконка           |
| LOL Guides      | Кастомная иконка           |
| Other Bookmarks | Системная папка            |

**Search bar / адресная строка:**

- Google `G` лого: `1920px-Google__G__Logo 1`
- Иконки: `mdi_star_border` (избранное), `Line 6` (разделитель)

---

## 5. Чат-интерфейс внутри браузера (только Фрейм B)

### 5.1 ChatMessage — сообщение от коллеги

```
width: 272px
height: 99px
```

**Аватар отправителя:**

```
width: 32px
height: 32px
border-radius: 999px  /* circle */
background: image (фото коллеги)
```

**Текстовый пузырь (content frame):**

```
background: #ffffff
border: 1px solid #e2e8f0
border-radius: 8px
width: 182px
height: 63px
padding: ~8px
```

**Текст сообщения:**

```
font-family: DM Sans
font-weight: 400
font-size: 12px
line-height: 16px
color: #314158
text: "Срочно проверь отчёт по проекту! Кликни по ссылке: https://bit.ly/3Xabc123"
```

**Имя отправителя (`Дима коллега`):**

```
font-family: DM Sans
font-weight: 500
font-size: 16px
letter-spacing: -1.12px
line-height: 74px
color: #000000
```

---

## 6. Alert — информационная подсказка урока

### 6.1 Фрейм A — описание задачи

```
background: #ffffff
border: 1px solid #e2e8f0
border-radius: 8px
width: 866px
height: 76px
position: absolute; bottom: ~64px (над taskbar); centered
```

**Аватар внутри Alert:**

```
width: 44px
height: 44px
border-radius: 999px
background: image + overlay rgba(0,0,0,0.2)
```

**Текст alert:**

```
font-family: DM Sans
font-weight: 500
font-size: 14px
line-height: 20px
color: #0f172b
text: "Ты на работе, общаешься в корпоративном мессенджере и почте. Учись распознавать простые угрозы."
```

**Кнопка закрытия (ButtonNeutral):**

```
width: 24px
height: 24px
border-radius: 6px
```

### 6.2 Фрейм B — доп. действие

```
background: rgba(241, 245, 249, 0.5)  /* #f1f5f9, opacity: 0.5 */
border-radius: 8px
width: 216px
height: 46px
position: absolute; bottom-left area
```

**Иконка:** `terminal` (20×20px)

**Текст:**

```
font-family: DM Sans
font-weight: 500
font-size: 14px
line-height: 20px
color: #0f172b
text: "Игнорировать сообщение"
```

---

## 7. Taskbar (нижняя панель)

```
background: linear-gradient(#f8f4f466, #f8f4f466)  /* сверху вниз */
border-radius: 20px
width: 1382px
height: 82px
position: absolute; bottom: 3px; left: 29px
```

**Разделитель `Line 17`:**

```
border: 1px solid #0d0b0b
height: 59px
orientation: vertical
```

### 7.1 Аватар пользователя (круглая иконка)

```
width: 48px
height: 48px
border-radius: 100px
background: #c09aff
```

- **Фрейм A:** иконка `user-round` (28×28px)
- **Фрейм B:** иконка `captions-off` (24×24px)

### 7.2 Иконки Dock (в обоих фреймах)

| Имя                           | Размер    |
| ----------------------------- | --------- |
| `image 49` (Finder)           | `42×53px` |
| `icons8_chrome_48px`          | `45×53px` |
| `icons8_note_48px`            | `49×54px` |
| `icons8_microsoft_powerpoint` | `47×51px` |
| `icons8_microsoft_publisher`  | `49×50px` |
| `icons8_microsoft_word`       | `52×49px` |
| `icons8_microsoft_access`     | `49×53px` |
| `icons8_wordpress`            | `43×53px` |
| `icons8_documents_48px_1`     | `58×56px` |
| `image 92` (Finder Mascot)    | `42×53px` |

### 7.3 Дополнительные иконки Dock (только Фрейм B)

| Имя                       | Размер                           |
| ------------------------- | -------------------------------- |
| `icons8_adventures_48px`  | `57×51px`                        |
| `icons8_facetime_48px`    | `54×57px`                        |
| `icons8_mail_48px`        | `65×52px`                        |
| `image 56` (circled icon) | `48×48px`, `border-radius: 38px` |

---

## 8. Footer (брендинг партнёра)

Компонент `Footer` — ширина `1440px`, высота `80px`.

**Группа `Group 8` — логотип:**

| Текст       | Шрифт   | Размер | Вес | Цвет      | Line-height |
| ----------- | ------- | ------ | --- | --------- | ----------- |
| `СТРЕПСИЛС` | DM Sans | 20px   | 900 | `#000000` | `20px`      |
| `х`         | DM Sans | 20px   | 500 | `#000000` | `20px`      |

`image 41` (логотип Reckitt): `189×40px`

---

## 9. Cursor (курсор мыши)

`icons8_cursor_24px 1` — `25×39px`, фильтры: exposure `-1`, contrast `-0.3`, saturation `-1` (чёрный указатель).

---

## 10. Сравнение двух состояний

| Элемент             | Фрейм A (начальный)                | Фрейм B (при наведении)                                        |
| ------------------- | ---------------------------------- | -------------------------------------------------------------- |
| ChatMessage         | Отсутствует                        | Виден — подозрительное сообщение от «Дима коллега» со ссылкой  |
| Alert               | Белый, 866×76, описание урока      | Полупрозрачный (#f1f5f9 50%), 216×46, «Игнорировать сообщение» |
| Аватар в Taskbar    | `user-round` (иконка пользователя) | `captions-off` (иконка)                                        |
| Иконки Dock         | Базовый набор                      | + adventures, facetime, mail, image 56                         |
| Закладки в браузере | Нет                                | URLScan, Inspirations, Work, Memes, LOL Guides                 |
| Чат-аватар + имя    | Нет                                | Фото коллеги + «Дима коллега»                                  |
