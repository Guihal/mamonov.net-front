import type { LessonConfig } from '~/types/lesson'
import type { MascotPhraseInput } from '~/types/mascot'
import type { GameControllerContext } from '~/types/game'
import RouterPanel from './RouterPanel.vue'

function looksLikePassword(text: string): boolean {
  // Эвристика: 8+ символов, нет пробелов или есть спецсимволы
  return (
    typeof text === 'string' && text.length >= 8 && (!/\s/.test(text) || /[^\wа-яА-ЯёЁ]/.test(text))
  )
}

// Очереди реплик маскота для этапов и ошибок
function getMascotPhrases(ctrl: GameControllerContext) {
  return {
    start: [
      {
        text: 'Смотри — письмо от «провайдера» И сообщение от соседа. Оба пришли одновременно. Подозрительно, правда?',
        emotion: 'worried' as const
      }
    ],
    mailOpen: [
      {
        text: 'Отправитель — «domru-update.ru». У Дом.ру адрес — domru.ru. Это не совпадает!',
        emotion: 'worried' as const
      }
    ],
    mailCheck: [
      {
        text: 'Видишь? «domru-update.ru» — это не настоящий сайт Дом.ру. Это классический приём — название похоже, но добавлено слово «update».',
        emotion: 'neutral' as const
      },
      {
        text: 'Настоящий провайдер никогда не присылает ссылки для обновления роутера по email. Это делается через личный кабинет или звонок от реального инженера.',
        emotion: 'neutral' as const
      }
    ],
    messenger: [
      {
        text: 'С соседом вопрос непростой. Казалось бы, знакомый человек... Но пароль от Wi-Fi — это доступ ко всей твоей домашней сети.',
        emotion: 'neutral' as const
      },
      {
        text: 'Если хочешь помочь — создай гостевую сеть в настройках роутера. Она изолирована от основной.',
        emotion: 'neutral' as const
      }
    ],
    routerPanel: [
      {
        text: 'Вот правильный способ! Панель роутера доступна по адресу 192.168.0.1 в браузере. Без всяких ссылок из почты.',
        emotion: 'happy' as const
      }
    ],
    complete: [
      { text: 'Ты справился с двумя атаками сразу!', emotion: 'happy' as const },
      {
        text: 'Правило 1: провайдеры не присылают ссылки для обновления роутера по email.',
        emotion: 'happy' as const
      },
      {
        text: 'Правило 2: пароль Wi-Fi — это доступ к твоей сети. Для гостей — отдельная гостевая сеть.',
        emotion: 'happy' as const
      },
      {
        text: 'Правило 3: настройки роутера всегда через браузер на 192.168.0.1 — без сторонних сайтов.',
        emotion: 'happy' as const,
        delay: 6000,
        onAfterDismiss: () => ctrl.complete()
      }
    ],
    failPhishLink: [
      { text: 'Ой!', emotion: 'sad' as const, delay: 700 },
      {
        text: 'Ты перешёл по ссылке из фишингового письма. Такой сайт может украсть данные для входа в панель роутера или установить малварь.',
        emotion: 'sad' as const
      }
    ],
    failPhishForm: [
      { text: 'Нет-нет-нет!', emotion: 'sad' as const, delay: 700 },
      {
        text: 'Ты ввёл пароль Wi-Fi на стороннем сайте. Теперь злоумышленники могут подключиться к твоей сети и перехватывать весь твой трафик.',
        emotion: 'sad' as const
      }
    ],
    failNeighbor: [
      { text: 'Подожди...', emotion: 'worried' as const, delay: 600 },
      {
        text: 'Ты отправил пароль от Wi-Fi в мессенджер. Даже если сосед честный человек — сообщения могут перехватить. А ещё это доступ ко всей твоей локальной сети.',
        emotion: 'sad' as const
      }
    ]
  }
}

const wifiSecurityConfig: LessonConfig = {
  id: 'home-wifi-security',
  categoryId: 'home',
  programs: ['mail', 'browser', 'messenger'],

  wifiConfig: {
    networks: [
      { id: 'home', ssid: 'TP-Link_Home_2G', signalLevel: 4, isSecured: true },
      { id: 'home-5g', ssid: 'TP-Link_Home_5G', signalLevel: 3, isSecured: true },
      { id: 'neighbor', ssid: 'Keenetic_Antosha', signalLevel: 2, isSecured: true }
    ],
    connectedId: 'home'
  },

  mailEmails: [
    {
      id: 'router-update',
      folder: 'inbox',
      from: 'Служба поддержки Дом.ру',
      fromEmail: 'support@domru-update.ru',
      to: 'user@gmail.com',
      subject: 'Важно! Обновите прошивку вашего роутера',
      body: 'Уважаемый абонент, в вашем роутере обнаружена критическая уязвимость CVE-2024-1234. Для обновления прошивки перейдите по ссылке: http://update-router-now.ru/tp-link\n\nЕсли вы не выполните обновление в течение 24 часов, ваш аккаунт может быть заблокирован.',
      date: '2024-01-15 09:42',
      isRead: false
    }
  ],

  messengerChats: [
    {
      id: 'neighbor',
      name: 'Сосед Антоша 🏠',
      messages: [
        {
          id: '1',
          sender: 'Антоша',
          text: 'Привет! У меня интернет пропал, дай пароль от вайфая на денёк? 😊',
          isOwn: false,
          timestamp: '09:55'
        }
      ]
    }
  ],

  browserSites: [{ url: 'router://192.168.0.1', title: 'Панель роутера', component: RouterPanel }],

  quickActions: [
    {
      id: 'guest-network',
      icon: 'i-lucide-wifi',
      label: 'Создать гостевую сеть',
      visibleOnSteps: [2],
      onClick: (ctrl) => {
        ctrl.mascot.enqueue([
          {
            text: 'Отлично! Гостевая сеть изолирована от основной — сосед получит интернет, но не доступ к твоим устройствам.',
            emotion: 'happy'
          }
        ])
        ctrl.goToStep(3)
      }
    },
    {
      id: 'call-provider',
      icon: 'i-lucide-phone',
      label: 'Позвонить провайдеру',
      visibleOnSteps: [3],
      onClick: (ctrl) => {
        ctrl.mascot.enqueue(getMascotPhrases(ctrl).complete)
      }
    }
  ],

  events: {
    mail: {
      onMailOpen: (ctrl, emailId) => {
        if (emailId === 'router-update' && ctrl.step.value < 1) {
          ctrl.goToStep(1)
          ctrl.mascot.enqueue(getMascotPhrases(ctrl).mailOpen)
        }
      },
      onAttachmentOpen: (ctrl, _emailId, _attachmentId) => {
        ctrl.fail('Вы открыли вложение из подозрительного письма!')
      }
    },
    browser: {
      onUrlNavigate: (ctrl, url) => {
        if (url.includes('update-router-now')) {
          ctrl.mascot.enqueue(getMascotPhrases(ctrl).failPhishLink)
          ctrl.fail('Вы перешли по ссылке из фишингового письма!')
          return
        }
        if (url === 'tools://url-checker' && ctrl.step.value < 2) {
          ctrl.mascot.enqueue(getMascotPhrases(ctrl).mailCheck)
          ctrl.goToStep(2)
        }
        if (url === 'router://192.168.0.1' && ctrl.step.value >= 2) {
          ctrl.mascot.enqueue(getMascotPhrases(ctrl).routerPanel)
        }
      },
      onFormSubmit: (ctrl, url, _data) => {
        if (url.includes('update-router-now')) {
          ctrl.mascot.enqueue(getMascotPhrases(ctrl).failPhishForm)
          ctrl.fail('Вы ввели пароль Wi-Fi на фишинговом сайте!')
          return
        }
        if (url === 'router://192.168.0.1') {
          ctrl.mascot.enqueue(getMascotPhrases(ctrl).complete)
        }
      }
    },
    messenger: {
      onMessageSend: (ctrl, chatId, text) => {
        if (chatId === 'neighbor' && looksLikePassword(text)) {
          ctrl.mascot.enqueue(getMascotPhrases(ctrl).failNeighbor)
          ctrl.fail('Вы поделились паролем Wi-Fi в мессенджере!')
        } else if (chatId === 'neighbor') {
          ctrl.mascot.enqueue(getMascotPhrases(ctrl).messenger)
          if (ctrl.step.value < 3) ctrl.goToStep(3)
        }
      }
    }
  },

  mascotPhrases: {
    greet:
      'Письмо от «провайдера» И сообщение от соседа. Оба пришли одновременно. Подозрительно, правда?'
  }
}

export function onLessonMounted(mascot: {
  enqueue: (items: MascotPhraseInput | MascotPhraseInput[]) => void
}) {
  mascot.enqueue([
    {
      text: 'Смотри — письмо от «провайдера» И сообщение от соседа. Оба пришли одновременно. Подозрительно, правда?',
      emotion: 'worried'
    }
  ])
}

export default wifiSecurityConfig
