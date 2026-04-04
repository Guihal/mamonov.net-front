import type { Category, Lesson, HpState } from '~/lib/api.types'

export const MOCK_CATEGORIES: Category[] = [
  { id: 'phishing', name: 'Фишинг', difficulty: 1, progress: 0.3 },
  { id: 'passwords', name: 'Пароли', difficulty: 1, progress: 0.6 },
  { id: 'social-engineering', name: 'Социальная инженерия', difficulty: 2, progress: 0.1 },
  { id: 'malware', name: 'Вредоносное ПО', difficulty: 3, progress: 0 },
  { id: 'network-security', name: 'Сетевая безопасность', difficulty: 2, progress: 0.45 },
  { id: 'cryptography', name: 'Криптография', difficulty: 4, progress: 0.8 },
  { id: 'web-security', name: 'Веб-безопасность', difficulty: 3, progress: 0.2 },
  { id: 'data-protection', name: 'Защита данных', difficulty: 2, progress: 0.55 }
]

export const MOCK_LESSONS: Record<string, Lesson[]> = {
  phishing: [
    {
      id: 'phishing-1',
      title: 'Что такое фишинг?',
      componentSlug: 'phishing-intro',
      difficulty: 1,
      isCompleted: true
    },
    {
      id: 'phishing-2',
      title: 'Как распознать фишинговое письмо',
      componentSlug: 'phishing-email',
      difficulty: 1,
      isCompleted: true
    },
    {
      id: 'phishing-3',
      title: 'Фишинговые сайты',
      componentSlug: 'phishing-sites',
      difficulty: 2,
      isCompleted: false
    },
    {
      id: 'phishing-4',
      title: 'Защита от фишинга',
      componentSlug: 'phishing-defense',
      difficulty: 2,
      isCompleted: false
    }
  ],
  passwords: [
    {
      id: 'passwords-1',
      title: 'Надёжные пароли',
      componentSlug: 'passwords-intro',
      difficulty: 1,
      isCompleted: true
    },
    {
      id: 'passwords-2',
      title: 'Менеджеры паролей',
      componentSlug: 'passwords-managers',
      difficulty: 1,
      isCompleted: true
    },
    {
      id: 'passwords-3',
      title: 'Двухфакторная аутентификация',
      componentSlug: 'passwords-2fa',
      difficulty: 2,
      isCompleted: false
    }
  ],
  'social-engineering': [
    {
      id: 'se-1',
      title: 'Методы социальной инженерии',
      componentSlug: 'se-methods',
      difficulty: 2,
      isCompleted: false
    },
    {
      id: 'se-2',
      title: 'Как не стать жертвой',
      componentSlug: 'se-protection',
      difficulty: 2,
      isCompleted: false
    }
  ],
  malware: [
    {
      id: 'malware-1',
      title: 'Виды вредоносного ПО',
      componentSlug: 'malware-types',
      difficulty: 3,
      isCompleted: false
    },
    {
      id: 'malware-2',
      title: 'Вирусы и черви',
      componentSlug: 'malware-viruses',
      difficulty: 3,
      isCompleted: false
    },
    {
      id: 'malware-3',
      title: 'Трояны и рансомвер',
      componentSlug: 'malware-trojans',
      difficulty: 4,
      isCompleted: false
    }
  ],
  'network-security': [
    {
      id: 'net-1',
      title: 'Основы сетей',
      componentSlug: 'net-basics',
      difficulty: 2,
      isCompleted: true
    },
    {
      id: 'net-2',
      title: 'Wi-Fi безопасность',
      componentSlug: 'net-wifi',
      difficulty: 2,
      isCompleted: false
    },
    {
      id: 'net-3',
      title: 'VPN и шифрование',
      componentSlug: 'net-vpn',
      difficulty: 3,
      isCompleted: false
    }
  ],
  cryptography: [
    {
      id: 'crypto-1',
      title: 'Основы криптографии',
      componentSlug: 'crypto-basics',
      difficulty: 3,
      isCompleted: true
    },
    {
      id: 'crypto-2',
      title: 'Симметричное шифрование',
      componentSlug: 'crypto-symmetric',
      difficulty: 4,
      isCompleted: true
    },
    {
      id: 'crypto-3',
      title: 'Асимметричное шифрование',
      componentSlug: 'crypto-asymmetric',
      difficulty: 4,
      isCompleted: true
    },
    {
      id: 'crypto-4',
      title: 'Хеш-функции',
      componentSlug: 'crypto-hash',
      difficulty: 4,
      isCompleted: false
    }
  ],
  'web-security': [
    {
      id: 'web-1',
      title: 'XSS атаки',
      componentSlug: 'web-xss',
      difficulty: 3,
      isCompleted: false
    },
    {
      id: 'web-2',
      title: 'SQL-инъекции',
      componentSlug: 'web-sqli',
      difficulty: 3,
      isCompleted: false
    },
    {
      id: 'web-3',
      title: 'CSRF атаки',
      componentSlug: 'web-csrf',
      difficulty: 3,
      isCompleted: false
    }
  ],
  'data-protection': [
    {
      id: 'data-1',
      title: 'Персональные данные',
      componentSlug: 'data-personal',
      difficulty: 2,
      isCompleted: true
    },
    {
      id: 'data-2',
      title: 'Резервное копирование',
      componentSlug: 'data-backup',
      difficulty: 2,
      isCompleted: false
    }
  ]
}

export const MOCK_HP: Record<string, HpState> = {
  phishing: { current: 8, max: 10 },
  passwords: { current: 6, max: 10 },
  'social-engineering': { current: 10, max: 10 },
  malware: { current: 10, max: 10 },
  'network-security': { current: 7, max: 10 },
  cryptography: { current: 3, max: 10 },
  'web-security': { current: 10, max: 10 },
  'data-protection': { current: 9, max: 10 }
}
