import type { LessonConfig } from '~/types/lesson'
import type { MascotPhraseInput } from '~/types/mascot'
import type { GameControllerContext } from '~/types/game'
import SocialPage from './SocialPage.vue'

// Топ очевидных паролей
export const OBVIOUS_PASSWORDS = [
  '123456',
  'qwerty',
  'password',
  'iloveyou',
  'admin',
  'letmein',
  'welcome',
  'monkey',
  'abc123',
  '111111',
  '123123',
  '12345678',
  '000000'
]

// Проверка слабого пароля
export function isWeakPassword(password: string): boolean {
  if (!password) return true
  const lower = password.toLowerCase()
  if (OBVIOUS_PASSWORDS.includes(lower)) return true
  if (/^\d{6,8}$/.test(password)) return true // только цифры, 6-8 знаков
  if (password.length < 8) return true
  if (/^(0[1-9]|[12][0-9]|3[01])(0[1-9]|1[0-2])\d{4}$/.test(password)) return true // дата DDMMYYYY
  // только буквы или только цифры
  if (/^[a-zA-Z]+$/.test(password) || /^\d+$/.test(password)) return true
  return false
}

const weakPasswordConfig: LessonConfig = {
  id: 'home-weak-password',
  categoryId: 'home',
  programs: ['browser'],
  browserSites: [
    {
      url: 'social://mypage',
      title: 'МояСоцСеть — Профиль',
      component: SocialPage,
      favicon: '/img/icons/social.png'
    }
  ],
  quickActions: [
    {
      id: 'use-password-manager',
      icon: 'i-lucide-key-round',
      label: 'Использовать менеджер паролей',
      visibleOnSteps: [0, 1],
      onClick: (ctrl) => {
        ctrl.goToStep(2)
        ctrl.mascot.enqueue([
          {
            text: 'Отлично! Теперь такой пароль подобрать практически невозможно.',
            emotion: 'happy'
          },
          {
            text: 'Кстати, используй разные пароли для разных сайтов. Если один утечёт — остальные будут в безопасности.',
            emotion: 'neutral'
          }
        ])
      }
    },
    {
      id: 'save-password',
      icon: 'i-lucide-save',
      label: 'Запомнить в менеджере',
      visibleOnSteps: [2],
      onClick: (ctrl) => {
        ctrl.mascot.enqueue([
          { text: 'Молодец! Пароль обновлён.', emotion: 'happy' },
          {
            text: 'Правило 1: длина важнее сложности — 16 случайных символов лучше, чем «P@ssw0rd».',
            emotion: 'happy'
          },
          { text: 'Правило 2: один сайт — один уникальный пароль.', emotion: 'happy' },
          {
            text: 'Правило 3: используй менеджер паролей — он запомнит всё за тебя.',
            emotion: 'happy',
            delay: 5000,
            onAfterDismiss: () => ctrl.complete()
          }
        ])
      }
    }
  ],
  events: {
    browser: {
      onPopupClose: (ctrl) => {
        ctrl.mascot.enqueue([
          { text: 'Подожди!', emotion: 'worried', delay: 600 },
          {
            text: 'Ты закрыл форму, не сменив пароль. Если злоумышленник уже знает твой текущий пароль — аккаунт по-прежнему под угрозой.',
            emotion: 'sad'
          }
        ])
        ctrl.fail('Вы не сменили скомпрометированный пароль!')
      },
      onFormSubmit: (ctrl, url, data) => {
        const newPassword = data['new-password'] ?? data['newPassword'] ?? data['password'] ?? ''
        if (isWeakPassword(newPassword)) {
          const isObvious = OBVIOUS_PASSWORDS.includes(newPassword.toLowerCase())
          ctrl.mascot.enqueue(
            isObvious
              ? [
                  { text: 'Серьёзно?', emotion: 'sad', delay: 600 },
                  {
                    text: 'Это один из самых популярных паролей в мире. Хакер подберёт его за долю секунды.',
                    emotion: 'sad'
                  }
                ]
              : [
                  { text: 'О нет...', emotion: 'sad', delay: 800 },
                  {
                    text: `Пароль «${newPassword}» подбирается за секунды. Хакеры проверяют миллионы вариантов автоматически.`,
                    emotion: 'sad'
                  }
                ]
          )
          ctrl.fail('Вы установили слабый пароль!')
        } else {
          ctrl.goToStep(2)
          ctrl.mascot.enqueue([
            {
              text: 'Отлично! Теперь такой пароль подобрать практически невозможно.',
              emotion: 'happy'
            },
            {
              text: 'Кстати, используй разные пароли для разных сайтов. Если один утечёт — остальные будут в безопасности.',
              emotion: 'neutral'
            }
          ])
        }
      }
    }
  },
  mascotPhrases: {
    greet: 'Твои данные попали в утечку! Нужно сменить пароль — но сделать это правильно.'
  }
}

export function onLessonMounted(mascot: {
  enqueue: (items: MascotPhraseInput | MascotPhraseInput[]) => void
}) {
  mascot.enqueue([
    { text: 'Привет! Ты в соцсети... но что-то не так.', emotion: 'neutral', delay: 1500 },
    {
      text: 'Твои данные попали в утечку! Это значит, что кто-то мог получить твой пароль. Нужно его сменить — но сделать это правильно.',
      emotion: 'worried'
    },
    {
      text: 'Хороший пароль — не имя, не дата рождения и не «qwerty». Длинный, случайный, с символами.',
      emotion: 'neutral'
    }
  ])
}

export default weakPasswordConfig
