import type { LessonConfig } from '~/types/lesson'
import type { MascotPhraseInput } from '~/types/mascot'
import type { GameControllerContext } from '~/types/game'
import type { ProgramType } from '~~/shared/types/Program'
import type { Component } from 'vue'

const CorpPortal: Component = {} as Component // TODO: заменить на реальный компонент

function looksLikePassword(text: string): boolean {
  return /[a-zA-Z]/.test(text) && /\d/.test(text) && text.length >= 6
}

function getMascotPhrases(ctrl: GameControllerContext) {
  return {
    step1: [
      {
        text: 'Запомни раз и навсегда: настоящий IT-отдел НИКОГДА не просит пароль. Ни по почте, ни в мессенджере, ни по телефону. Это нарушает базовые принципы безопасности.',
        emotion: 'worried' as const
      }
    ],
    step2: [
      {
        text: 'Письмо от HR — с адреса «corp-hr-update.com». Настоящий HR в вашей компании — «hr@corp.ru». Снова подмена домена.',
        emotion: 'neutral' as const
      },
      {
        text: 'Ссылка «corp-data-update.ru» — тоже посторонний домен. Настоящие HR-формы либо на корпоративном портале, либо в официальной системе кадров.',
        emotion: 'neutral' as const
      }
    ],
    step3: [
      {
        text: 'Ты правильно разобрался с обеими атаками. Это называется двойная социальная инженерия — атаки по разным каналам одновременно, чтобы создать ощущение срочности.',
        emotion: 'happy' as const
      }
    ],
    complete: [
      { text: 'Ты устоял перед двойной атакой по двум каналам!', emotion: 'happy' as const },
      {
        text: 'Правило 1: IT никогда не просит пароль. Это аксиома. Любой запрос пароля — красный флаг.',
        emotion: 'happy' as const
      },
      {
        text: 'Правило 2: проверяй домен отправителя любого запроса — особенно если он «срочный» и «обязательный».',
        emotion: 'happy' as const
      },
      {
        text: 'Правило 3: при сомнениях — всегда звони напрямую по официальным контактам, не отвечай в том же канале.',
        emotion: 'happy' as const,
        delay: 6000,
        onAfterDismiss: () => ctrl.complete()
      }
    ]
  }
}

export const socialEngineeringConfig: LessonConfig = {
  id: 'office-social-engineering',
  categoryId: 'office',
  programs: ['messenger', 'mail', 'browser'] as ProgramType[],

  messengerChats: [
    {
      id: 'fake-it',
      name: 'Артём IT-поддержка 🛠',
      messages: [
        {
          id: '1',
          sender: 'Артём IT',
          text: 'Добрый день! Мы проводим плановый аудит учётных записей. Для продолжения работы необходимо подтвердить данные: отправьте ваш логин и текущий пароль от корпоративной почты. Это займёт 2 минуты.',
          isOwn: false,
          timestamp: '14:02'
        }
      ]
    }
  ],

  mailEmails: [
    {
      id: 'hr-update',
      folder: 'inbox',
      from: 'Отдел кадров',
      fromEmail: 'hr@corp-hr-update.com',
      subject: 'Обновление персональных данных — обязательно до пятницы',
      body: 'Уважаемый коллега!\n\nВ соответствии с внутренним регламентом просим обновить ваши персональные данные до конца недели.\n\nПожалуйста, перейдите по ссылке: http://corp-data-update.ru/form\n\nС уважением,\nОтдел кадров',
      date: '13:45',
      isRead: false
    }
  ],

  browserSites: [{ url: 'corp://portal', title: 'Корпоративный портал', component: CorpPortal }],

  quickActions: [
    {
      id: 'report-both',
      icon: 'i-lucide-shield-alert',
      label: 'Сообщить в ИБ',
      visibleOnSteps: [2],
      onClick: (ctrl) => {
        ctrl.mascot.enqueue(getMascotPhrases(ctrl).step3)
        ctrl.goToStep(3)
      }
    },
    {
      id: 'call-real-it',
      icon: 'i-lucide-phone',
      label: 'Позвонить в реальный IT',
      visibleOnSteps: [3],
      onClick: (ctrl) => {
        ctrl.mascot.enqueue(getMascotPhrases(ctrl).complete)
      }
    }
  ],

  events: {
    messenger: {
      onMessageSend: (ctrl, chatId, text) => {
        if (chatId === 'fake-it' && looksLikePassword(text)) {
          ctrl.mascot.enqueue([
            { text: 'Нет!', emotion: 'sad', delay: 600 },
            {
              text: 'Ты отправил пароль корпоративной почты мошеннику. Теперь у него полный доступ к твоей рабочей переписке.',
              emotion: 'sad'
            },
            {
              text: 'Настоящий IT-отдел никогда не просит текущий пароль — они сбрасывают его через систему.',
              emotion: 'sad'
            }
          ])
          ctrl.fail('Вы отправили корпоративный пароль мошеннику!')
        }
      }
    },
    browser: {
      onUrlNavigate: (ctrl, url) => {
        if (url.includes('corp-data-update')) {
          ctrl.mascot.enqueue([
            { text: 'Подожди-подожди!', emotion: 'worried', delay: 700 },
            {
              text: 'corp-data-update.ru — посторонний сайт, который может скопировать данные браузера.',
              emotion: 'sad'
            }
          ])
          ctrl.fail('Вы перешли по фишинговой ссылке из письма HR!')
          return
        }
        // corp://portal → шаг 2 (проверил корпоративный портал)
        if (url === 'corp://portal' && ctrl.step.value < 2) {
          ctrl.goToStep(2)
          ctrl.mascot.enqueue(getMascotPhrases(ctrl).step2)
          return
        }
        // tools://url-checker → шаг 3
        if (url === 'tools://url-checker' && ctrl.step.value < 3) {
          ctrl.goToStep(3)
          ctrl.mascot.enqueue(getMascotPhrases(ctrl).step3)
        }
      },
      onFormSubmit: (ctrl, url, _data) => {
        if (url.includes('corp-data-update')) {
          ctrl.mascot.enqueue([
            { text: 'Ой...', emotion: 'sad', delay: 700 },
            {
              text: 'Ты ввёл персональные данные на стороннем сайте. Всё попало к злоумышленникам.',
              emotion: 'sad'
            }
          ])
          ctrl.fail('Вы ввели персональные данные на фишинговом сайте!')
        }
      }
    },
    mail: {
      onMailOpen: (ctrl, emailId) => {
        if (emailId === 'hr-update' && ctrl.step.value < 1) {
          ctrl.goToStep(1)
          ctrl.mascot.enqueue(getMascotPhrases(ctrl).step1)
        }
      },
      onLinkClick: (ctrl, _emailId, url) => {
        if (url.includes('corp-data-update')) {
          ctrl.mascot.enqueue([
            { text: 'Подожди-подожди!', emotion: 'worried', delay: 700 },
            {
              text: 'corp-data-update.ru — посторонний сайт, который может скопировать данные браузера.',
              emotion: 'sad'
            }
          ])
          ctrl.fail('Вы перешли по фишинговой ссылке из письма HR!')
        }
      }
    }
  },

  mascotPhrases: {
    greet:
      '«IT» просит пароль, HR требует заполнить форму. Оба «срочно». Проверь — у кого вообще есть право просить такое?'
  }
}

export function onLessonMounted(mascot: {
  enqueue: (items: MascotPhraseInput | MascotPhraseInput[]) => void
}) {
  mascot.enqueue([
    {
      text: 'Подожди. «Артём из IT» просит пароль. HR просит перейти по ссылке. Оба пришли почти одновременно. Это очень подозрительно.',
      emotion: 'worried'
    },
    {
      text: 'Запомни раз и навсегда: настоящий IT-отдел НИКОГДА не просит пароль. Ни по почте, ни в мессенджере, ни по телефону.',
      emotion: 'worried'
    }
  ])
}
