import { defineAsyncComponent } from 'vue'
import type { LessonConfig } from '~/types/lesson'
import type { MascotPhraseInput } from '~/types/mascot'
import type { GameControllerContext } from '~/types/game'
import { popupVisible, resetFakeUpdateState } from './state'

const FakeNewsPage = defineAsyncComponent(() => import('./FakeNewsPage.vue'))

/** Реплики шага 3 + завершения. Последняя реплика вызывает complete(). */
function buildCompletionPhrases(ctrl: GameControllerContext): MascotPhraseInput[] {
  return [
    // Шаг 3
    {
      text: 'Отлично! Ты не повёлся на панику. Именно на неё и рассчитывают мошенники.',
      emotion: 'happy'
    },
    {
      text: 'Запомни: обновления Flash Player никогда не приходят через сторонние сайты — Flash вообще закрыт с 2020 года.',
      emotion: 'neutral'
    },
    // Завершение
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
      delay: 6000,
      onAfterDismiss: () => ctrl.complete()
    }
  ]
}

/** Общий обработчик закрытия попапа (шаг 3 → complete). */
function handlePopupClose(ctrl: GameControllerContext) {
  if (ctrl.step.value >= 3) return
  popupVisible.value = false
  ctrl.goToStep(3)
  ctrl.mascot.enqueue(buildCompletionPhrases(ctrl))
}

export const fakeUpdateConfig: LessonConfig = {
  id: 'home-fake-update',
  categoryId: 'home',
  programs: ['browser'],

  startPaths: {
    browser: '/browser/news-daily.ru'
  },

  browserSites: [
    {
      url: 'https://news-daily.ru',
      title: 'Ежедневные новости — Главная',
      component: FakeNewsPage
    }
  ],

  events: {
    browser: {
      onPopupClose: (ctrl) => handlePopupClose(ctrl),

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
        } else if (url === 'tools://url-checker' && ctrl.step.value < 2) {
          ctrl.goToStep(2)
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
        }
      },

      onTabClose: (ctrl, url) => {
        if (url.includes('url-checker')) {
          handlePopupClose(ctrl)
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
            text: 'Ты скачал файл с сайта «update-flash-now.site». Это не официальный источник — такой файл с высокой вероятностью содержит вредоносное ПО.',
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
