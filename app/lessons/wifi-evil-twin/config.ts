import type { LessonConfig } from '~/types/lesson'
import type { MascotPhraseInput } from '~/types/mascot'
import type { GameControllerContext } from '~/types/game'

/** Реплики маскота для каждого этапа */
function getMascotPhrases(ctrl: GameControllerContext) {
  return {
    start: [
      {
        text: 'Две почти одинаковые сети. Одна — официальная сеть аэропорта. Другая — ловушка. Ты уже подключён к одной из них. Как понять, к правильной?',
        emotion: 'worried' as const
      }
    ],
    askStaff: [
      {
        text: 'Сотрудник аэропорта говорит: «Наша сеть — Airport_Free_WiFi. Without 5G.»',
        emotion: 'neutral' as const
      }
    ],
    step1Neutral: [
      {
        text: 'Самый простой способ — спросить у сотрудника. Официальное название и пароль сети часто написаны на стойке регистрации или в зале ожидания.',
        emotion: 'neutral' as const
      }
    ],
    networkInfo: [
      {
        text: 'Видишь? Ты подключён к Airport_Free_WiFi_5G, а официальная сеть — Airport_Free_WiFi. Кто-то создал поддельную точку с суффиксом «5G» — звучит как «быстрее и лучше», но на самом деле это ловушка.',
        emotion: 'worried' as const
      }
    ],
    disconnected: [
      {
        text: 'Видишь эти сообщения? Они пришли, пока ты был подключён к поддельной сети. Злоумышленник может рассылать всё что угодно — ты в его «локальной сети».',
        emotion: 'worried' as const
      },
      {
        text: 'Никогда не переходи по ссылкам из «системных уведомлений» Wi-Fi. Настоящие порталы аэропортов открываются автоматически при подключении — они не требуют от тебя пароль от почты.',
        emotion: 'neutral' as const
      }
    ],
    complete: [
      { text: 'Ты распознал Evil Twin атаку!', emotion: 'happy' as const },
      {
        text: 'Правило 1: всегда уточняй официальное название сети у персонала или смотри на информационную стойку.',
        emotion: 'happy' as const
      },
      {
        text: 'Правило 2: подозрительная сеть с похожим названием + суффикс «5G», «_free», «_plus» — классический Evil Twin.',
        emotion: 'happy' as const
      },
      {
        text: 'Правило 3: системные уведомления от Wi-Fi-сети, которые просят ввести пароль от почты — это всегда фишинг.',
        emotion: 'happy' as const,
        delay: 6000,
        onAfterDismiss: () => ctrl.complete()
      }
    ],
    failLinkClick: [
      { text: 'Стоп!', emotion: 'sad' as const, delay: 600 },
      {
        text: 'Ты перешёл по ссылке от поддельной Wi-Fi-сети. Такие «системные уведомления» всегда генерирует сам злоумышленник — это не настоящий аэропорт.',
        emotion: 'sad' as const
      }
    ],
    failFormSubmit: [
      { text: 'О нет...', emotion: 'sad' as const, delay: 700 },
      {
        text: 'Ты ввёл данные на сайте злоумышленника. В реальной ситуации он сейчас видит всё, что ты написал — email, пароль, любую другую информацию.',
        emotion: 'sad' as const
      }
    ],
    failReply: [
      { text: 'Подожди!', emotion: 'worried' as const, delay: 600 },
      {
        text: 'Ты ответил на письмо с «подтверждением», которое пришло через поддельную сеть. Отправитель — мошенник, он получил твои данные.',
        emotion: 'sad' as const
      }
    ],
    failMailLink: [
      { text: 'Стоп!', emotion: 'sad' as const, delay: 600 },
      {
        text: 'Ты перешёл по ссылке из письма, которое пришло через поддельную сеть. Отправитель — мошенник, и этот сайт создан для кражи твоих данных.',
        emotion: 'sad' as const
      }
    ]
  }
}

export const evilTwinConfig: LessonConfig = {
  id: 'wifi-evil-twin',
  categoryId: 'public-wifi',
  programs: ['browser', 'messenger', 'mail'],

  wifiConfig: {
    networks: [
      {
        id: 'fake-5g',
        ssid: 'Airport_Free_WiFi_5G',
        signalLevel: 4,
        isSecured: false,
        isFake: true
      },
      { id: 'real', ssid: 'Airport_Free_WiFi', signalLevel: 3, isSecured: false },
      { id: 'staff', ssid: 'Airport_Staff_Internal', signalLevel: 2, isSecured: true },
      { id: 'vip', ssid: 'VIP_Lounge_WiFi', signalLevel: 1, isSecured: true }
    ],
    connectedId: 'fake-5g',
    onDisconnect: (ctrl, networkId) => {
      if (networkId === 'fake-5g') {
        ctrl.goToStep(2)
        ctrl.mascot.enqueue(getMascotPhrases(ctrl).disconnected)
      }
    },
    onConnect: (ctrl, networkId) => {
      if (networkId === 'real') {
        if (ctrl.step.value < 2) ctrl.goToStep(2)
        ctrl.mascot.enqueue(getMascotPhrases(ctrl).complete)
      } else if (networkId === 'fake-5g') {
        ctrl.mascot.enqueue([
          {
            text: 'Ты снова подключился к подозрительной сети с 5G в названии. Попробуй другую.',
            emotion: 'worried' as const
          }
        ])
      }
    }
  },

  browserSites: [],

  messengerChats: [
    {
      id: 'fake-wifi-notification',
      name: 'Airport_Free_WiFi_5G',
      messages: [
        {
          id: '1',
          sender: 'Airport_Free_WiFi_5G',
          text: 'Ваш сеанс истекает. Для продолжения доступа обновите данные: http://airport-wifi-update.ru/confirm',
          isOwn: false,
          timestamp: '14:23'
        }
      ]
    }
  ],

  mailEmails: [
    {
      id: 'wifi-confirm',
      folder: 'inbox',
      from: 'Airport WiFi Service',
      fromEmail: 'noreply@airport-update.net',
      subject: 'Подтверждение регистрации в сети аэропорта',
      body: '<p>Ваша регистрация в сети аэропорта требует подтверждения email.</p><p>Перейдите по ссылке для подтверждения: <a href="http://airport-wifi-update.ru/email-confirm">http://airport-wifi-update.ru/email-confirm</a></p><p>Если вы не подтверждаете регистрацию в течение 24 часов, доступ к сети будет приостановлен.</p>',
      date: '2026-04-05T14:25:00',
      isRead: false
    }
  ],

  quickActions: [
    {
      id: 'ask-staff',
      icon: 'i-lucide-user-check',
      label: 'Уточнить сеть у персонала',
      visibleOnSteps: [0, 1],
      onClick: (ctrl) => {
        ctrl.goToStep(2)
        ctrl.mascot.enqueue(getMascotPhrases(ctrl).askStaff)
      }
    },
    {
      id: 'disconnect',
      icon: 'i-lucide-wifi-off',
      label: 'Отключиться от сети',
      visibleOnSteps: [0, 1],
      onClick: (ctrl) => {
        ctrl.wifiDisconnect()
        ctrl.goToStep(2)
        ctrl.mascot.enqueue(getMascotPhrases(ctrl).disconnected)
      }
    },
    {
      id: 'connect-real',
      icon: 'i-lucide-wifi',
      label: 'Подключиться к настоящей сети',
      visibleOnSteps: [2],
      onClick: (ctrl) => {
        ctrl.wifiConnect('real')
        ctrl.mascot.enqueue(getMascotPhrases(ctrl).complete)
      }
    }
  ],

  events: {
    browser: {
      onUrlNavigate: (ctrl, url) => {
        // Пользователь перешёл на фишинговый сайт
        if (url.includes('airport-wifi-update')) {
          ctrl.mascot.enqueue(getMascotPhrases(ctrl).failLinkClick)
          ctrl.fail('Вы открыли фишинговый сайт поддельной WiFi-точки!')
        }
      },
      onFormSubmit: (ctrl, url, _data) => {
        if (url.includes('airport-wifi-update')) {
          ctrl.mascot.enqueue(getMascotPhrases(ctrl).failFormSubmit)
          ctrl.fail('Вы ввели данные на фишинговом сайте поддельной WiFi-точки!')
        }
      }
    },
    messenger: {
      onLinkClick: (ctrl, chatId, _url) => {
        if (chatId === 'fake-wifi-notification') {
          ctrl.mascot.enqueue(getMascotPhrases(ctrl).failLinkClick)
          ctrl.fail('Вы перешли по ссылке из системного уведомления поддельной сети!')
        }
      }
    },
    mail: {
      onLinkClick: (ctrl, _emailId, url) => {
        if (url.includes('airport-wifi-update')) {
          ctrl.mascot.enqueue(getMascotPhrases(ctrl).failMailLink)
          ctrl.fail('Вы перешли по ссылке из фишингового письма поддельной WiFi-точки!')
        }
      },
      onReply: (ctrl, emailId, _text) => {
        if (emailId === 'wifi-confirm') {
          ctrl.mascot.enqueue(getMascotPhrases(ctrl).failReply)
          ctrl.fail('Вы ответили на фишинговое письмо от поддельной WiFi-точки!')
        }
      }
    }
  },

  mascotPhrases: {
    greet: 'Две одинаковые сети в аэропорту. Одна — ловушка. Как отличить настоящую от поддельной?'
  }
}

/** Колбэк onMounted — стартовые реплики маскота */
export function onLessonMounted(mascot: {
  enqueue: (items: MascotPhraseInput | MascotPhraseInput[]) => void
}) {
  mascot.enqueue([
    {
      text: 'Ты в аэропорту. Смотри на доступные сети Wi-Fi — не всё то золото, что блестит.',
      emotion: 'neutral',
      delay: 1500
    },
    {
      text: 'Две почти одинаковые сети. Одна — официальная сеть аэропорта. Другая — ловушка. Ты уже подключён к одной из них. Как понять, к правильной?',
      emotion: 'worried'
    }
  ])
}
