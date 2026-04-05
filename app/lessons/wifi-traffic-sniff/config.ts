import { defineAsyncComponent } from 'vue'
import type { LessonConfig } from '~/types/lesson'
import type { MascotPhraseInput } from '~/types/mascot'
import type { GameControllerContext } from '~/types/game'

const vpnEnabled = ref(false)

export function resetTrafficSniffState() {
  vpnEnabled.value = false
}

const FakeBankHttpPage = defineAsyncComponent(
  () => import('~/components/OS/Programs/Browser/pages/FakeBankHttpPage.vue')
)
const FakeBankHttpsPage = defineAsyncComponent(
  () => import('~/components/OS/Programs/Browser/pages/FakeBankHttpsPage.vue')
)

/** Реплики маскота для каждого этапа */
function getMascotPhrases(ctrl: GameControllerContext) {
  return {
    start: [
      {
        text: 'Ты в кафе, открытый Wi-Fi без пароля. Такой сигнал не зашифрован — любой в этой сети может "подслушать" твой трафик.',
        emotion: 'worried' as const
      },
      {
        text: 'Попробуй открыть сайт банка — посмотрим, что получится.',
        emotion: 'neutral' as const,
        delay: 3000
      }
    ],
    httpOpened: [
      {
        text: 'Смотри на адресную строку! Там написано «Не защищено» и нет замочка. HTTP без S означает — данные передаются открытым текстом.',
        emotion: 'worried' as const
      }
    ],
    httpsOpened: [
      {
        text: 'Хорошо — есть замок. HTTPS шифрует данные. Но даже с HTTPS в открытой сети лучше использовать VPN для полной защиты.',
        emotion: 'neutral' as const
      }
    ],
    vpnEnabled: [
      {
        text: 'VPN включён! Теперь твой трафик зашифрован на участке от тебя до VPN-сервера. Люди в кафе больше не смогут перехватить твои данные.',
        emotion: 'happy' as const
      },
      {
        text: 'Но VPN — это не HTTPS! Участок от VPN-сервера до сайта всё ещё может быть открытым. Видишь — в адресной строке по-прежнему «Не защищено».',
        emotion: 'worried' as const
      },
      {
        text: 'Открой сайт банка по HTTPS — тогда шифрование будет сквозным: от тебя до самого сайта, через VPN-туннель.',
        emotion: 'neutral' as const
      }
    ],
    complete: [
      { text: 'Идеально! VPN + HTTPS = двойная защита.', emotion: 'happy' as const },
      {
        text: 'VPN шифрует туннель от тебя до VPN-сервера — защита от локальных перехватчиков в кафе.',
        emotion: 'happy' as const
      },
      {
        text: 'HTTPS шифрует данные от браузера до сайта — сквозная защита, даже если кто-то в середине.',
        emotion: 'happy' as const
      },
      {
        text: 'Вместе они дополняют друг друга. А для банковских операций лучше вообще использовать мобильный интернет.',
        emotion: 'happy' as const,
        delay: 6000,
        onAfterDismiss: () => ctrl.complete()
      }
    ],
    failPassword: [
      { text: 'О нет!', emotion: 'sad' as const, delay: 600 },
      {
        text: 'Ты ввёл пароль на HTTP-сайте в открытой сети. Это всё равно, что написать пароль на бумажке и показать всем в кафе.',
        emotion: 'sad' as const
      },
      {
        text: 'Инструмент Wireshark за несколько секунд перехватил бы этот запрос и показал твой пароль в открытом виде.',
        emotion: 'sad' as const
      }
    ],
    failCard: [
      { text: 'Нет-нет-нет!', emotion: 'sad' as const, delay: 600 },
      {
        text: 'Данные карты через открытый Wi-Fi без VPN — это подарок мошенникам. Никогда не вводи платёжные данные в публичных сетях без защиты.',
        emotion: 'sad' as const
      }
    ]
  }
}

/** Колбэк при монтировании страницы урока */
export function onLessonMounted(mascot: {
  enqueue: (items: MascotPhraseInput | MascotPhraseInput[]) => void
}) {
  resetTrafficSniffState()
  mascot.enqueue(getMascotPhrases({} as GameControllerContext).start)
}

export const trafficSniffConfig: LessonConfig = {
  id: 'wifi-traffic-sniff',
  categoryId: 'public-wifi',
  programs: ['browser'],

  startPaths: {
    browser: 'search://home'
  },

  wifiConfig: {
    networks: [
      { id: 'cafe-open', ssid: 'CoffeeShop_Free', signalLevel: 4, isSecured: false },
      { id: 'neighbor-1', ssid: 'Rostelecom_5G_8F', signalLevel: 2, isSecured: true },
      { id: 'neighbor-2', ssid: 'TP-Link_4A2B', signalLevel: 1, isSecured: true }
    ],
    connectedId: 'cafe-open',
    vpnLabel: 'VPN',
    onVpnToggle: (ctrl, enabled) => {
      vpnEnabled.value = enabled
      if (enabled) {
        ctrl.mascot.enqueue(getMascotPhrases(ctrl).vpnEnabled)
        ctrl.goToStep(2)
      }
    }
  },

  browserSites: [
    {
      url: 'http://mybank-online.ru',
      title: '⚠️ МойБанк (небезопасно)',
      component: FakeBankHttpPage
    },
    {
      url: 'https://mybank-online.ru',
      title: '🔒 МойБанк',
      component: FakeBankHttpsPage
    }
  ],

  browserBookmarks: [
    { label: 'Мой банк', url: 'http://mybank-online.ru', icon: 'i-lucide-building-2' }
  ],

  quickActions: [],

  events: {
    browser: {
      onFormSubmit: (ctrl, url, data) => {
        if (!url.startsWith('http:')) return
        if (!data.password && !data.cardNumber) return

        const isCard = !!data.cardNumber
        ctrl.mascot.enqueue(
          isCard ? getMascotPhrases(ctrl).failCard : getMascotPhrases(ctrl).failPassword
        )
        ctrl.fail('Вы ввели данные на незащищённом сайте в открытой сети!')
      },
      onUrlNavigate: (ctrl, url) => {
        const step = ctrl.step.value

        // Шаг 0 → 1: пользователь открыл сайт банка
        if (step === 0) {
          if (url === 'http://mybank-online.ru') {
            ctrl.goToStep(1)
            ctrl.mascot.enqueue(getMascotPhrases(ctrl).httpOpened)
          } else if (url === 'https://mybank-online.ru') {
            ctrl.goToStep(1)
            ctrl.mascot.enqueue(getMascotPhrases(ctrl).httpsOpened)
          }
        }

        // Шаг 2 (VPN включён): пользователь открывает HTTPS-сайт банка → complete
        if (step === 2 && url === 'https://mybank-online.ru') {
          ctrl.mascot.enqueue(getMascotPhrases(ctrl).complete)
        }
      },
      onBookmarkClick: (ctrl, url) => {
        if (url === 'http://mybank-online.ru' && ctrl.step.value === 0) {
          ctrl.goToStep(1)
          ctrl.mascot.enqueue(getMascotPhrases(ctrl).httpOpened)
        }
      }
    }
  },

  mascotPhrases: {
    greet:
      'Ты в кафе, открытый Wi-Fi без пароля. Всё, что ты отправляешь — может быть видно другим в этой сети.'
  }
}
