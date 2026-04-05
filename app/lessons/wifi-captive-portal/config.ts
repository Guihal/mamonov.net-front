import { defineAsyncComponent } from 'vue'
import type { LessonConfig } from '~/types/lesson'
import type { MascotPhraseInput } from '~/types/mascot'
import type { GameControllerContext } from '~/types/game'

const CaptivePortalPage = defineAsyncComponent(
  () => import('~/components/OS/Programs/Browser/pages/CaptivePortalPage.vue')
)

function getMascotPhrases(ctrl: GameControllerContext) {
  return {
    step2: [
      {
        text: 'Правильно! Этот «портал» — фишинговая страница, цель которой — украсть логин и пароль от соцсетей или почты.',
        emotion: 'neutral' as const
      }
    ],
    step3: [
      { text: 'Ты закрыл фейковый портал. Молодец!', emotion: 'happy' as const },
      {
        text: 'Если хочешь всё же зайти в Wi-Fi ТЦ — используй только официальный портал, который не просит внешних паролей.',
        emotion: 'neutral' as const
      }
    ],
    complete: [
      { text: 'Ты распознал фишинговый captive portal!', emotion: 'happy' as const },
      {
        text: 'Правило 1: настоящий портал Wi-Fi просит только номер телефона или просто «Принять условия». Пароль от ВК или Google — никогда.',
        emotion: 'happy' as const
      },
      {
        text: 'Правило 2: посмотри на домен страницы авторизации — он должен совпадать с названием заведения или быть официальным.',
        emotion: 'happy' as const
      },
      {
        text: 'Правило 3: для важных дел — мобильный интернет надёжнее публичного Wi-Fi. Трафик через 4G/5G значительно сложнее перехватить.',
        emotion: 'happy' as const,
        delay: 6000,
        onAfterDismiss: () => ctrl.complete()
      }
    ]
  }
}

export const captivePortalConfig: LessonConfig = {
  id: 'wifi-captive-portal',
  categoryId: 'public-wifi',
  programs: ['browser'],

  wifiConfig: {
    networks: [
      { id: 'mall-wifi', ssid: 'MegaMall_Free_WiFi', signalLevel: 4, isSecured: false },
      { id: 'mall-staff', ssid: 'MegaMall_Staff', signalLevel: 2, isSecured: true },
      { id: 'neighbor', ssid: 'TP-Link_5G_A3', signalLevel: 1, isSecured: true }
    ],
    connectedId: 'mall-wifi',
    onDisconnect: (ctrl, networkId) => {
      if (networkId === 'mall-wifi' && ctrl.step.value >= 2) {
        ctrl.mascot.enqueue(getMascotPhrases(ctrl).step3)
        ctrl.goToStep(3)
      }
    }
  },

  browserSites: [
    {
      url: 'captive://mall-wifi',
      title: 'Wi-Fi авторизация — ТЦ МегаМолл',
      component: CaptivePortalPage
    }
  ],

  quickActions: [
    {
      id: 'check-domain',
      icon: 'i-lucide-shield-check',
      label: 'Проверить домен портала',
      visibleOnSteps: [0, 1],
      onClick: (ctrl) => {
        ctrl.openBrowserTab('tools://url-checker')
        ctrl.mascot.enqueue(getMascotPhrases(ctrl).step2)
        ctrl.goToStep(2)
      }
    },
    {
      id: 'ask-staff-mall',
      icon: 'i-lucide-user-check',
      label: 'Уточнить у персонала',
      visibleOnSteps: [0, 1],
      onClick: (ctrl) => {
        ctrl.mascot.enqueue([
          {
            text: 'Сотрудник говорит: "Наш портал только спрашивает номер телефона. Он не просит пароли от соцсетей."',
            emotion: 'neutral'
          }
        ])
        ctrl.goToStep(2)
      }
    },
    {
      id: 'read-fine-print',
      icon: 'i-lucide-file-text',
      label: 'Читать мелкий шрифт',
      visibleOnSteps: [0, 1],
      onClick: (ctrl) => {
        ctrl.mascot.enqueue([
          {
            text: 'Видишь внизу? «mall-free-wifi-auth.ru». Это не сайт ТЦ «МегаМолл» — это посторонний домен, который притворяется порталом.',
            emotion: 'worried'
          }
        ])
        ctrl.goToStep(2)
      }
    },
    {
      id: 'use-mobile-data',
      icon: 'i-lucide-signal',
      label: 'Использовать мобильный интернет',
      visibleOnSteps: [2, 3],
      onClick: (ctrl) => {
        ctrl.mascot.enqueue(getMascotPhrases(ctrl).complete)
      }
    }
  ],

  events: {
    browser: {
      onFormSubmit: (ctrl, url, data) => {
        if (!url.includes('mall-free-wifi')) return
        const isGoogle = !!(data.googleEmail || data.googlePassword)
        const isVk = !!(data.vkLogin || data.vkPassword)
        if (isGoogle) {
          ctrl.mascot.enqueue([
            { text: 'О нет!', emotion: 'sad', delay: 600 },
            {
              text: 'Пароль Google — это ключ ко всей экосистеме: Gmail, Drive, Photos, Play Store, Android-устройству. Это один из самых ценных паролей для злоумышленника.',
              emotion: 'sad'
            }
          ])
        } else if (isVk) {
          ctrl.mascot.enqueue([
            { text: 'Нет!', emotion: 'sad', delay: 500 },
            {
              text: 'Ты ввёл пароль от ВКонтакте на стороннем сайте. Кнопка «Войти через VK» на фейковом сайте — это не OAuth. Это просто форма, которая забирает всё, что ты вводишь.',
              emotion: 'sad'
            },
            {
              text: 'Мошенник теперь имеет доступ к твоим сообщениям и, возможно, привязанной карте.',
              emotion: 'sad'
            }
          ])
        } else {
          ctrl.mascot.enqueue([
            { text: 'Ой...', emotion: 'sad', delay: 600 },
            {
              text: 'Ты ввёл email и пароль на фишинговой странице. Теперь у злоумышленника есть доступ к твоей почте — а через неё можно сбросить пароли от большинства других сервисов.',
              emotion: 'sad'
            }
          ])
        }
        ctrl.fail('Вы ввели учётные данные на фишинговом captive-портале!')
      },
      onTabClose: (ctrl, url) => {
        if (url === 'captive://mall-wifi' && ctrl.step.value < 3) {
          ctrl.mascot.enqueue(getMascotPhrases(ctrl).step3)
          ctrl.goToStep(3)
        }
      }
    }
  },

  mascotPhrases: {
    greet: 'Подключился к Wi-Fi в торговом центре. Посмотрим, что за портал тут открылся...'
  }
}

export function onLessonMounted(mascot: {
  enqueue: (items: MascotPhraseInput | MascotPhraseInput[]) => void
}) {
  mascot.enqueue([
    {
      text: 'Ты в торговом центре «МегаМолл». Подключился к бесплатному Wi-Fi — в браузере автоматически открылся портал для авторизации.',
      emotion: 'neutral',
      delay: 1500
    },
    {
      text: 'Такие порталы — обычное дело в общественных местах. Кафе, аэропорты, торговые центры — везде просят подтвердить подключение.',
      emotion: 'neutral'
    },
    {
      text: 'Но подожди... Посмотри внимательно, что именно этот портал у тебя просит. Что-то тут не так.',
      emotion: 'worried'
    },
    {
      text: 'Зачем порталу торгового центра твой пароль от ВКонтакте? Он не имеет к ВКонтакте никакого отношения!',
      emotion: 'worried'
    },
    {
      text: 'Реальные captive-порталы просят только номер телефона (для SMS) или просто кнопку «Принять условия». Пароли от внешних сервисов им не нужны.',
      emotion: 'neutral'
    }
  ])
}
