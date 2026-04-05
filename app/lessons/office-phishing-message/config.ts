import type { LessonConfig } from '~/types/lesson'
import type { MascotPhraseInput } from '~/types/mascot'
import type { GameControllerContext } from '~/types/game'

/** Реплики маскота для этапов и ошибок */
function getMascotPhrases(ctrl: GameControllerContext) {
  return {
    step1: [
      {
        text: 'Укороченная ссылка — bit.ly скрывает реальный адрес. Никогда не переходи по таким ссылкам вслепую — сначала проверь, куда она ведёт.',
        emotion: 'neutral' as const
      }
    ],
    urlCheckerResult: [
      {
        text: 'Вот оно! bit.ly/3xAbc99 → fake-yourbank-login.ru. Это явно не рабочий отчёт по Q1.',
        emotion: 'neutral' as const
      },
      {
        text: 'Кстати, даже если бы ссылка выглядела нормально — рабочие документы в компании не хранят на случайных сайтах. Их отправляют через корпоративное облако.',
        emotion: 'neutral' as const
      }
    ],
    dimaPersonal: [
      {
        text: 'Хорошо — ты уточнил у Димы лично. Это правильный подход!',
        emotion: 'happy' as const
      }
    ],
    step3: [
      {
        text: 'Отлично! Ты не перешёл по ссылке под давлением дедлайна.',
        emotion: 'happy' as const
      },
      {
        text: 'К слову — аккаунт Димы скорее всего взломали. Именно так и работают атаки через доверенных людей.',
        emotion: 'neutral' as const
      }
    ],
    complete: [
      {
        text: 'Урок пройден! Ты устоял перед давлением «срочно, дедлайн!».',
        emotion: 'happy' as const
      },
      {
        text: 'Правило 1: укороченные ссылки всегда проверяй перед переходом — они скрывают реальный адрес.',
        emotion: 'happy' as const
      },
      {
        text: 'Правило 2: срочность и давление — главные инструменты фишинга. Чем сильнее торопят, тем подозрительнее.',
        emotion: 'happy' as const
      },
      {
        text: 'Правило 3: если ссылку прислал «знакомый» — уточни у него другим способом (позвони, напиши лично).',
        emotion: 'happy' as const,
        delay: 6000,
        onAfterDismiss: () => ctrl.complete()
      }
    ],
    failLinkClick: [
      { text: 'Ой!', emotion: 'sad' as const, delay: 600 },
      {
        text: 'Ты перешёл по ссылке прямо из мессенджера. Укороченная ссылка скрывала фишинговый сайт — теперь он знает твой IP и может определить браузер.',
        emotion: 'sad' as const
      }
    ],
    failUrlNavigate: [
      { text: 'Стоп...', emotion: 'worried' as const, delay: 700 },
      {
        text: 'Ты сам вписал фишинговый адрес в браузер. Любопытство — понятно, но это ровно то, на что рассчитывает атака.',
        emotion: 'sad' as const
      }
    ],
    failFormSubmit: [
      { text: 'Нет!', emotion: 'sad' as const, delay: 500 },
      {
        text: 'Ты ввёл свои данные на фишинговом сайте. Теперь они у злоумышленника. Именно так воруют корпоративные аккаунты и деньги со счетов.',
        emotion: 'sad' as const
      }
    ]
  }
}

const phishingMessageConfig: LessonConfig = {
  id: 'office-phishing-message',
  categoryId: 'office',
  programs: ['messenger', 'browser'],
  openOnStart: ['messenger'],
  messengerOpenChatId: 'work-chat',

  messengerChats: [
    {
      id: 'work-chat',
      name: 'Рабочий чатик',
      isGroupChat: true,
      messages: [
        { id: '1', sender: 'Катя HR', text: 'Всем привет!', isOwn: false, timestamp: '08:32' },
        {
          id: '2',
          sender: 'Паша разраб',
          text: 'Созвон в 15:00, не забудьте',
          isOwn: false,
          timestamp: '09:01'
        },
        { id: '3', sender: 'Ты', text: 'Буду', isOwn: true, timestamp: '09:03' },
        {
          id: '4',
          sender: 'Дима коллега',
          text: 'Привет всем! Срочно нужна помощь — проверьте отчёт по Q1, там что-то не сходится. Вот файл: https://bit.ly/3xAbc99 — откройте быстрее, дедлайн через час!',
          isOwn: false,
          timestamp: '10:17'
        }
      ]
    },
    {
      id: 'dima-personal',
      name: 'Дима коллега',
      messages: [],
      isGroupChat: false
    }
  ],

  quickActions: [
    {
      id: 'call-security',
      icon: 'i-lucide-phone',
      label: 'Позвонить в ИБ',
      visibleOnSteps: [2],
      onClick: (ctrl) => {
        ctrl.mascot.enqueue(getMascotPhrases(ctrl).step3)
        ctrl.goToStep(3)
      }
    },
    {
      id: 'complete-lesson',
      icon: 'i-lucide-check-circle',
      label: 'Завершить урок',
      visibleOnSteps: [3],
      onClick: (ctrl) => {
        ctrl.mascot.enqueue(getMascotPhrases(ctrl).complete)
      }
    }
  ],

  events: {
    messenger: {
      onLinkClick: (ctrl, _chatId, _url) => {
        ctrl.mascot.enqueue(getMascotPhrases(ctrl).failLinkClick)
        ctrl.fail('Вы перешли по фишинговой ссылке в мессенджере!')
      },
      onMessageSend: (ctrl, chatId, text) => {
        if (chatId === 'dima-personal' && text.trim().length > 0) {
          setTimeout(() => {
            ctrl.messengerPushMessage('dima-personal', {
              id: `dima-reply-${Date.now()}`,
              sender: 'Дима коллега',
              text: 'Я ничего не отправлял! Кажется, мой аккаунт взломали...',
              timestamp: new Date().toISOString(),
              isOwn: false
            })
          }, 1500)
          ctrl.mascot.enqueue(getMascotPhrases(ctrl).dimaPersonal)
          ctrl.mascot.enqueue(getMascotPhrases(ctrl).step3)
          ctrl.goToStep(3)
        }
      }
    },
    browser: {
      onUrlNavigate: (ctrl, url) => {
        if (url.includes('bit.ly') || url.includes('fake-yourbank')) {
          ctrl.mascot.enqueue(getMascotPhrases(ctrl).failUrlNavigate)
          ctrl.fail('Вы открыли фишинговый сайт!')
          return
        }
        if (url === 'tools://url-checker' && ctrl.step.value < 2) {
          ctrl.goToStep(2)
          ctrl.mascot.enqueue(getMascotPhrases(ctrl).urlCheckerResult)
        }
      },
      onFormSubmit: (ctrl, url, _data) => {
        if (url.includes('url-checker')) return
        ctrl.mascot.enqueue(getMascotPhrases(ctrl).failFormSubmit)
        ctrl.fail('Вы ввели данные на фишинговом сайте!')
      }
    }
  },

  mascotPhrases: {
    greet: 'Обычный рабочий день в офисе. Посмотрим, что нового в мессенджере...'
  }
}

export function onLessonMounted(mascot: {
  enqueue: (items: MascotPhraseInput | MascotPhraseInput[]) => void
}) {
  mascot.enqueue([
    {
      text: 'Обычный рабочий день. Ты в офисе, открыт корпоративный мессенджер — коллеги обсуждают текущие задачи.',
      emotion: 'neutral',
      delay: 1500
    },
    {
      text: 'Мессенджеры на работе — привычный инструмент. Файлы, ссылки, обсуждения — всё здесь.',
      emotion: 'neutral'
    },
    {
      text: 'О, новое сообщение от Димы! «Срочно проверь отчёт, дедлайн через час!» И ссылка...',
      emotion: 'neutral'
    },
    {
      text: 'Подожди. Срочность, давление, «проверьте быстрее» — это типичные приёмы, чтобы ты не думал и просто кликнул. Не торопись!',
      emotion: 'worried'
    },
    {
      text: 'Укороченная ссылка — bit.ly скрывает реальный адрес. Никогда не переходи по таким ссылкам вслепую — сначала проверь, куда она ведёт.',
      emotion: 'neutral'
    },
    {
      text: 'Попробуй открыть браузер и зайти на tools://url-checker — там можно проверить, куда на самом деле ведёт ссылка. Или напиши Диме лично и уточни.',
      emotion: 'neutral'
    }
  ])
}

export default phishingMessageConfig
