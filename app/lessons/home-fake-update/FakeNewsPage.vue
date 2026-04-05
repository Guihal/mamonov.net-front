<script setup lang="ts">
import type { BrowserEvents } from '~/types/programs'
import { popupVisible } from './state'

const browserEvents = inject<BrowserEvents>('browserEvents', {})

// Попап появляется через 1500ms после монтирования
onMounted(() => {
  setTimeout(() => {
    popupVisible.value = true
  }, 1500)
})

const news = [
  {
    category: 'Погода',
    title: 'В выходные в Москве ожидается потепление до +12°C',
    text: 'Синоптики обещают солнечную погоду без осадков. Горожане смогут насладиться первым теплом весенних дней.',
    img: '🌤️'
  },
  {
    category: 'Экономика',
    title: 'Курс доллара снизился на 0.3 рубля по итогам торгов',
    text: 'На Московской бирже американская валюта завершила сессию на уровне 89.2 рубля за доллар.',
    img: '📉'
  },
  {
    category: 'Спорт',
    title: 'Российские хоккеисты победили в товарищеском матче со счётом 4:2',
    text: 'Сборная России провела контрольный матч в рамках подготовки к чемпионату. Голы забили Малкин и Овечкин.',
    img: '🏒'
  },
  {
    category: 'Технологии',
    title: 'Новый смартфон поступит в продажу в следующем месяце',
    text: 'Производитель анонсировал флагманскую модель с улучшенной камерой и увеличенным временем работы от батареи.',
    img: '📱'
  }
]
</script>

<template>
  <div class="fake-news">
    <!-- Шапка поддельного сайта -->
    <header class="fake-news__header">
      <div class="fake-news__logo">📰 Ежедневные новости</div>
      <nav class="fake-news__nav">
        <span>Главная</span>
        <span>Политика</span>
        <span>Экономика</span>
        <span>Спорт</span>
        <span>Технологии</span>
      </nav>
    </header>

    <!-- Новости -->
    <main class="fake-news__content">
      <article v-for="(item, i) in news" :key="i" class="fake-news__article">
        <div class="fake-news__article-img">{{ item.img }}</div>
        <div class="fake-news__article-body">
          <span class="fake-news__category">{{ item.category }}</span>
          <h2 class="fake-news__title">{{ item.title }}</h2>
          <p class="fake-news__text">{{ item.text }}</p>
        </div>
      </article>
    </main>

    <!-- Скам-попап -->
    <Transition name="popup-fade">
      <div v-if="popupVisible" class="scam-overlay">
        <div class="scam-popup">
          <div class="scam-popup__icon">⚠️</div>
          <h2 class="scam-popup__title">Ваш Flash Player версии 11.2 УСТАРЕЛ!</h2>
          <p class="scam-popup__subtitle">
            Обнаружена угроза безопасности. Немедленно скачайте обновление.
          </p>

          <button class="scam-popup__btn-download" @click="browserEvents.onPopupDownloadClick?.()">
            Скачать обновление (3.7 МБ)
          </button>
          <button class="scam-popup__btn-remind" @click="browserEvents.onPopupRemindClick?.()">
            Напомнить позже
          </button>

          <p class="scam-popup__url">update-flash-now.site/download</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss">
.fake-news {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background: #f8f8f8;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  &__header {
    background: #1a1a2e;
    color: #fff;
    padding: 12px 24px;
    display: flex;
    align-items: center;
    gap: 32px;
  }

  &__logo {
    font-size: 18px;
    font-weight: 700;
    white-space: nowrap;
  }

  &__nav {
    display: flex;
    gap: 20px;
    font-size: 13px;
    opacity: 0.8;

    span {
      cursor: pointer;

      &:hover {
        opacity: 1;
        text-decoration: underline;
      }
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: 16px 24px;
  }

  &__article {
    display: flex;
    gap: 16px;
    padding: 16px 0;
    border-bottom: 1px solid #e0e0e0;

    &:last-child {
      border-bottom: none;
    }
  }

  &__article-img {
    font-size: 40px;
    flex-shrink: 0;
    width: 56px;
    text-align: center;
  }

  &__article-body {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__category {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    color: #e53e3e;
    letter-spacing: 0.5px;
  }

  &__title {
    font-size: 15px;
    font-weight: 600;
    color: #1a1a1a;
    line-height: 1.3;
    margin: 0;
  }

  &__text {
    font-size: 13px;
    color: #6b6b6b;
    line-height: 1.4;
    margin: 0;
  }
}

// ── Скам-попап ────────────────────────────────────────────────────────────────

.scam-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.scam-popup {
  background: linear-gradient(145deg, #dc2626, #b91c1c);
  border-radius: 12px;
  padding: 28px 24px;
  max-width: 360px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  &__icon {
    font-size: 48px;
    animation: pulse 1s ease-in-out infinite;
  }

  &__title {
    font-size: 17px;
    font-weight: 800;
    color: #fff;
    line-height: 1.2;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  &__subtitle {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.85);
    margin: 0;
    line-height: 1.4;
  }

  &__btn-download {
    margin-top: 6px;
    width: 100%;
    padding: 13px 20px;
    background: #16a34a;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
      background: #15803d;
    }
  }

  &__btn-remind {
    width: 100%;
    padding: 8px 20px;
    background: rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.75);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    font-size: 13px;
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
      background: rgba(255, 255, 255, 0.25);
    }
  }

  &__url {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.4);
    margin: 0;
    font-family: monospace;
  }
}

// ── Анимации ──────────────────────────────────────────────────────────────────

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.popup-fade-enter-active,
.popup-fade-leave-active {
  transition: opacity 0.3s ease;
}

.popup-fade-enter-from,
.popup-fade-leave-to {
  opacity: 0;
}
</style>
