import { defineAsyncComponent } from 'vue'
import type { LessonConfig } from '~/types/lesson'
import { popupVisible, resetFakeUpdateState } from './state'

const FakeNewsPage = defineAsyncComponent(() => import('./FakeNewsPage.vue'))

export const fakeUpdateConfig: LessonConfig = {
  id: 'home-fake-update',
  categoryId: 'home',
  programs: ['browser'],

  browserSites: [
    {
      url: 'https://news-daily.ru',
      title: 'Ежедневные новости — Главная',
      component: FakeNewsPage
    }
  ],

  // Стартовые реплики маскота вызываются из [lessonSlug].vue через onMounted
  quickActions: [
    {
      id: 'check-url',
      icon: 'i-lucide-shield-check',
      label: 'Проверить URL',
      visibleOnSteps: [0, 1],
      onClick: (ctrl) => {
        ctrl.openBrowserTab('tools://url-checker')

        ctrl.mascot.enqueue([
          {
            text: 'Смотри: «update-flash-now.site» — это не adobe.com. Официальные обновления никогда не приходят через случайные сайты!',
            emotion: 'neutral'
          },
          {
            text: 'К тому же — Flash Player был официально закрыт в 2020 году. Его вообще больше не обновляют 😄',
            emotion: 'happy',
            delay: 5000
          }
        ])

        ctrl.nextStep() // → шаг 1
      }
    },
    {
      id: 'close-popup',
      icon: 'i-lucide-x-circle',
      label: 'Закрыть предупреждение',
      visibleOnSteps: [0, 1, 2],
      onClick: (ctrl) => {
        popupVisible.value = false

        ctrl.mascot.enqueue([
          {
            text: 'Отлично! Ты не повёлся на панику. Именно на неё и рассчитывают мошенники.',
            emotion: 'happy'
          },
          {
            text: 'Теперь проверь — нет ли других подозрительных вкладок, которые могли открыться.',
            emotion: 'neutral'
          }
        ])

        ctrl.goToStep(3)
      }
    },
    {
      id: 'check-tabs',
      icon: 'i-lucide-layout',
      label: 'Проверить все вкладки',
      visibleOnSteps: [3],
      onClick: (ctrl) => {
        ctrl.mascot.enqueue([
          { text: 'Ты справился! Запомни три правила:', emotion: 'happy' },
          {
            text: '1. Обновления ОС ставятся через Центр обновлений, а не через сайты.',
            emotion: 'happy'
          },
          {
            text: '2. Flash Player мёртв с 2020 года — никто его не «обновляет».',
            emotion: 'happy'
          },
          {
            text: '3. Если сайт кричит «СРОЧНО!» и «ОПАСНОСТЬ!» — это манипуляция. Сначала думай, потом кликай.',
            emotion: 'happy',
            delay: 6000
          }
        ])

        ctrl.complete()
      }
    }
  ],

  events: {
    browser: {
      onUrlNavigate: (ctrl, url) => {
        if (url.includes('update-flash-now')) {
          ctrl.mascot.enqueue([
            { text: 'Подожди...', emotion: 'worried', delay: 800 },
            {
              text: 'Ты сам открыл этот сайт? Мошенники именно на это и надеются — что ты из любопытства зайдёшь.',
              emotion: 'sad'
            }
          ])
          ctrl.fail('Вы зашли на фишинговый сайт!')
        }
      },
      onFormSubmit: (ctrl, url) => {
        if (url.includes('update-flash-now')) {
          ctrl.mascot.enqueue([
            { text: 'Стоп!', emotion: 'sad', delay: 500 },
            {
              text: 'Ты только что отправил свои данные мошенникам. Никогда не вводи личную информацию на сайтах, куда тебя «отправил» попап.',
              emotion: 'sad'
            }
          ])
          ctrl.fail('Вы ввели данные на фишинговом сайте!')
        }
      },
      onPopupDownloadClick: (ctrl) => {
        ctrl.mascot.enqueue([
          { text: 'Ой...', emotion: 'sad', delay: 1000 },
          {
            text: 'Ты нажал на кнопку загрузки с сайта «update-flash-now.site». Это не официальный источник — такой файл с высокой вероятностью содержит вредоносное ПО.',
            emotion: 'sad'
          }
        ])
        ctrl.fail('Вы нажали «Скачать обновление» на подозрительном сайте!')
      },
      onPopupRemindClick: (ctrl) => {
        ctrl.mascot.enqueue([
          { text: 'Нет-нет-нет!', emotion: 'sad', delay: 800 },
          {
            text: '«Напомнить позже» — это тоже ловушка. Сайт может записать согласие и начать показывать ещё больше рекламы или редиректов.',
            emotion: 'sad'
          }
        ])
        ctrl.fail('Вы согласились на напоминание от подозрительного попапа!')
      }
    }
  }
}

import type { MascotPhraseInput } from '~/types/mascot'

export function onLessonMounted(mascot: {
  enqueue: (items: MascotPhraseInput | MascotPhraseInput[]) => void
}) {
  resetFakeUpdateState()
  mascot.enqueue([
    { text: 'Ты читаешь новости...', emotion: 'neutral', delay: 1500 },
    {
      text: 'Хм, что-то всплыло! Не торопись нажимать — сначала разберись, что это такое.',
      emotion: 'worried'
    }
  ])
}
