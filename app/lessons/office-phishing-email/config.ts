import type { LessonConfig } from '~/types/lesson'
import type { MascotPhraseInput } from '~/types/mascot'
import type { GameControllerContext } from '~/types/game'

function getMascotPhrases(ctrl: GameControllerContext) {
  return {
    // Шаг 0 — старт, маскот при открытии письма
    mailOpen: [
      {
        text: 'Подожди — адрес отправителя «corp-holdings.net». Твоя компания называется corp.ru. Это разные домены. Директор пишет с рабочего адреса, а не с «holdings» на непонятном домене.',
        emotion: 'worried' as const
      }
    ],
    // Шаг 2 — проверил отправителя через url-checker
    checkedSender: [
      {
        text: 'Corp-holdings.net — домен зарегистрирован месяц назад. Твоя компания работает 12 лет. Это подделка.',
        emotion: 'neutral' as const
      }
    ],
    // Шаг 2 — проверил ссылку corp-portall.ru
    checkedLink: [
      {
        text: '«corp-portall.ru» — видишь две буквы l? Это называется тайпсквоттинг: регистрируют домены, похожие на настоящие, в расчёте на то, что ты не заметишь.',
        emotion: 'neutral' as const
      }
    ],
    // Шаг 2 — проверил вложение
    checkedAttachment: [
      {
        text: '«.xlsx.exe» — это исполняемый файл, замаскированный под таблицу Excel. Windows часто скрывает расширения — поэтому видно «Отчёт_Q4.xlsx», а настоящее расширение .exe спрятано.',
        emotion: 'neutral' as const
      }
    ],
    // Шаг 3 — сообщил в ИБ
    step3: [
      {
        text: 'Отлично! Ты нашёл признаки атаки и не поддался давлению срочности.',
        emotion: 'happy' as const
      },
      {
        text: 'Теперь важно сообщить в службу информационной безопасности — они заблокируют этот домен для всех коллег.',
        emotion: 'neutral' as const
      }
    ],
    // Финал
    complete: [
      {
        text: 'Ты защитил не только себя, но и всю компанию!',
        emotion: 'happy' as const
      },
      {
        text: 'Признак 1: проверяй домен отправителя — не только имя, а именно адрес после @.',
        emotion: 'happy' as const
      },
      {
        text: 'Признак 2: двойное расширение (.xlsx.exe, .pdf.exe) — всегда вирус.',
        emotion: 'happy' as const
      },
      {
        text: 'Признак 3: тайпсквоттинг — corp-portall.ru вместо corp-portal.ru. Одна лишняя буква всё меняет.',
        emotion: 'happy' as const,
        delay: 6000,
        onAfterDismiss: () => ctrl.complete()
      }
    ],
    // Fail: открыл вложение .exe
    failAttachment: [
      { text: 'О нет!', emotion: 'sad' as const, delay: 600 },
      {
        text: 'Ты запустил .exe файл. На реальном компьютере это могло установить кейлоггер, шифровальщик или открыть удалённый доступ для злоумышленника.',
        emotion: 'sad' as const
      }
    ],
    // Fail: перешёл по ссылке corp-portall.ru
    failLink: [
      { text: 'Поймали!', emotion: 'sad' as const, delay: 700 },
      {
        text: 'Ты перешёл на corp-portall.ru — заметил опечатку? Две буквы «l» вместо одной. Это фишинговая страница, которая копирует внешний вид настоящего портала.',
        emotion: 'sad' as const
      }
    ],
    // Fail: ответил на письмо с данными
    failReply: [
      { text: 'Стоп!', emotion: 'sad' as const, delay: 500 },
      {
        text: 'Ты ответил на письмо с личными данными. Если отправитель — мошенник, он теперь знает твои данные и может продолжить атаку, представившись тобой.',
        emotion: 'sad' as const
      }
    ]
  }
}

/** Флаг: пользователь уже проверил хотя бы один признак (для показа QuickAction) */
let _checkedAny = false

const phishingEmailConfig: LessonConfig = {
  id: 'office-phishing-email',
  categoryId: 'office',
  programs: ['mail', 'browser'],
  openOnStart: ['mail'],

  mailEmails: [
    {
      id: 'quarterly-report',
      folder: 'inbox',
      from: 'Сергей Петрович Директор',
      fromEmail: 'director@corp-holdings.net',
      subject: 'СРОЧНО: Квартальный отчёт Q4 — подписать до 18:00',
      body: 'Иван, добрый день!\n\nПрошу срочно ознакомиться с отчётом и подтвердить данные. Вложение: Отчёт_Q4.xlsx.exe\n\nТакже сверьтесь с данными на нашем портале:\nhttp://corp-portall.ru/q4-report\n\nС уважением,\nСергей Петрович',
      date: '17:43',
      isRead: false,
      attachments: [
        {
          id: 'report-exe',
          name: 'Отчёт_Q4.xlsx.exe',
          icon: 'i-lucide-file-spreadsheet',
          isMalicious: true
        }
      ]
    },
    {
      id: 'meeting-notes',
      folder: 'inbox',
      from: 'Катя HR',
      fromEmail: 'katya@corp.ru',
      subject: 'Протокол совещания от 14.01',
      body: 'Всем привет! Во вложении протокол встречи. Ознакомьтесь.',
      date: '11:20',
      isRead: true
    },
    {
      id: 'lunch-reminder',
      folder: 'inbox',
      from: 'Офис',
      fromEmail: 'office@corp.ru',
      subject: 'Напоминание: корпоратив пятница',
      body: 'Коллеги, пятничный корпоратив начинается в 18:30 в переговорной №2.',
      date: '09:05',
      isRead: true
    }
  ],

  browserBookmarks: [
    {
      label: 'Проверка ссылок',
      url: 'tools://url-checker'
    },
    {
      label: 'Проверка файлов',
      url: 'tools://file-checker'
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
      id: 'confirm-security',
      icon: 'i-lucide-user-check',
      label: 'Уточнить реквизиты ИБ',
      visibleOnSteps: [3],
      onClick: (ctrl) => {
        ctrl.mascot.enqueue(getMascotPhrases(ctrl).complete)
      }
    }
  ],

  events: {
    mail: {
      onMailOpen: (ctrl, emailId) => {
        if (emailId === 'quarterly-report' && ctrl.step.value < 1) {
          ctrl.goToStep(1)
          ctrl.mascot.enqueue(getMascotPhrases(ctrl).mailOpen)
        }
      },
      onAttachmentOpen: (ctrl, _emailId, attachmentId) => {
        if (attachmentId === 'report-exe') {
          ctrl.mascot.enqueue(getMascotPhrases(ctrl).failAttachment)
          ctrl.fail('Вы открыли вредоносное вложение!')
        }
      },
      onLinkClick: (ctrl, emailId, url) => {
        if (emailId === 'quarterly-report' && url.includes('corp-portall')) {
          ctrl.mascot.enqueue(getMascotPhrases(ctrl).failLink)
          ctrl.fail('Вы перешли по фишинговой ссылке!')
        }
      },
      onReply: (ctrl, emailId, _text) => {
        if (emailId === 'quarterly-report') {
          ctrl.mascot.enqueue(getMascotPhrases(ctrl).failReply)
          ctrl.fail('Вы ответили на письмо злоумышленника!')
        }
      }
    },
    browser: {
      onUrlNavigate: (ctrl, url) => {
        // Прямой переход на фишинговый сайт — провал
        if (url.includes('corp-portall')) {
          ctrl.mascot.enqueue(getMascotPhrases(ctrl).failLink)
          ctrl.fail('Вы перешли по фишинговой ссылке!')
          return
        }

        // Проверил ссылку через url-checker
        if (url === 'tools://url-checker' && ctrl.step.value >= 1 && ctrl.step.value < 2) {
          _checkedAny = true
          ctrl.goToStep(2)
          ctrl.mascot.enqueue(getMascotPhrases(ctrl).checkedLink)
          return
        }

        // Проверил вложение через file-checker
        if (url === 'tools://file-checker' && ctrl.step.value >= 1 && ctrl.step.value < 2) {
          _checkedAny = true
          ctrl.goToStep(2)
          ctrl.mascot.enqueue(getMascotPhrases(ctrl).checkedAttachment)
          return
        }
      },
      onFormSubmit: (ctrl, url, _data) => {
        if (url.includes('corp-portall')) {
          ctrl.mascot.enqueue(getMascotPhrases(ctrl).failLink)
          ctrl.fail('Вы ввели данные на фишинговом сайте!')
        }
      }
    }
  },

  mascotPhrases: {
    greet: 'Письмо «от начальника». Срочно, до 18:00. Час пик для фишинга — когда люди устали и торопятся.'
  }
}

export function onLessonMounted(mascot: {
  enqueue: (items: MascotPhraseInput | MascotPhraseInput[]) => void
}) {
  _checkedAny = false
  mascot.enqueue([
    {
      text: 'Письмо «от начальника». Срочно, до 18:00. Час пик для фишинга — когда люди устали и торопятся.',
      emotion: 'worried'
    }
  ])
}

export default phishingEmailConfig
