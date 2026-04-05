export const MASCOT_PHRASES = {
  // Приветствия
  greet: 'Привет! Готов к уроку?',
  greetBack: 'Ты вернулся! Давай продолжим.',

  // Подсказки
  hintLink: 'Осторожно с незнакомыми ссылками!',
  hintEmail: 'Проверь адрес отправителя.',
  hintAttachment: 'Не открывай подозрительные вложения!',

  // Результаты
  correct: 'Отлично! Правильное решение!',
  almostCorrect: 'Почти! Но можно лучше.',
  fail: 'Ой, не повезло...',
  failExplain: 'Давай разберём, что пошло не так.',
  complete: 'Поздравляю! Урок пройден!',

  // HP
  hpLow: 'У тебя осталось мало HP, будь внимательнее!',
  hpDepleted: 'HP закончились... Подожди немного.',

  // Общее
  idle: 'Нужна помощь? Кликни на меня.'
} as const

export type MascotPhraseKey = keyof typeof MASCOT_PHRASES
