<script setup lang="ts">
import { ref, inject } from 'vue'
import type { BrowserEvents } from '~/types/programs'
import ChangePasswordForm from './ChangePasswordForm.vue'

const showBanner = ref(true)
const showForm = ref(false)

const browserEvents = inject<BrowserEvents>('browserEvents', {})

function openChangePassword() {
  showForm.value = true
}

function onFormSubmit(payload: { newPassword: string }) {
  browserEvents.onFormSubmit?.('social://mypage', payload)
}

function onFormDismiss() {
  browserEvents.onPopupClose?.()
  showForm.value = false
}

const user = {
  name: 'Алексей Мамонтов',
  handle: '@alexmam',
  avatar: '🧑‍💻',
  city: 'Москва',
  status: 'Учусь программировать 💻',
  friends: 148,
  followers: 312,
  photos: 24
}

const friends = [
  { name: 'Ирина К.', avatar: '👩‍🦰', online: true },
  { name: 'Дмитрий В.', avatar: '👨', online: true },
  { name: 'Олег С.', avatar: '🧔', online: false },
  { name: 'Мария Ш.', avatar: '👩', online: true },
  { name: 'Павел Л.', avatar: '👦', online: false },
  { name: 'Анна Р.', avatar: '👧', online: true }
]

const posts = [
  {
    id: 1,
    author: 'Алексей Мамонтов',
    authorAvatar: '🧑‍💻',
    time: '2 часа назад',
    text: 'Прошёл первый модуль курса по кибербезопасности! Оказывается, 80% утечек данных связаны со слабыми паролями 🤯',
    likes: 12,
    comments: 3,
    reposts: 1
  },
  {
    id: 2,
    author: 'Ирина К.',
    authorAvatar: '👩‍🦰',
    time: '4 часа назад',
    text: 'Ребята, а вы знали, что пароль «123456» остаётся самым популярным в мире уже 10 лет подряд? Серьёзно, смените уже свои пароли! 🔒',
    likes: 34,
    comments: 8,
    reposts: 5
  },
  {
    id: 3,
    author: 'Дмитрий В.',
    authorAvatar: '👨',
    time: '5 часов назад',
    text: 'Воскресный фотоотчёт с прогулки по парку Горького 🌳☀️ Погода — супер!',
    likes: 27,
    comments: 6,
    reposts: 0
  },
  {
    id: 4,
    author: 'ТехноНовости',
    authorAvatar: '📡',
    time: 'вчера в 21:30',
    text: 'Масштабная утечка данных затронула 26 млн аккаунтов популярного сервиса. Эксперты рекомендуют немедленно сменить пароли и включить двухфакторную аутентификацию.',
    likes: 189,
    comments: 42,
    reposts: 67
  }
]

const navItems = [
  { icon: '👤', label: 'Моя страница' },
  { icon: '💬', label: 'Сообщения', badge: 3 },
  { icon: '👥', label: 'Друзья' },
  { icon: '🏘️', label: 'Сообщества' },
  { icon: '📷', label: 'Фотографии' },
  { icon: '🎵', label: 'Музыка' },
  { icon: '🎬', label: 'Видео' },
  { icon: '⚙️', label: 'Настройки' }
]
</script>

<template>
  <div class="sp">
    <!-- Хедер -->
    <header class="sp-header">
      <div class="sp-header__left">
        <span class="sp-header__logo">🌐 МояСоцСеть</span>
      </div>
      <div class="sp-header__search">
        <input type="text" placeholder="Поиск..." class="sp-header__input" disabled />
      </div>
      <div class="sp-header__right">
        <span class="sp-header__user-avatar">{{ user.avatar }}</span>
        <span class="sp-header__user-name">{{ user.name.split(' ')[0] }}</span>
      </div>
    </header>

    <!-- Баннер утечки -->
    <Transition name="banner-slide">
      <div v-if="showBanner" class="sp-leak-banner">
        <div class="sp-leak-banner__icon">🔓</div>
        <div class="sp-leak-banner__body">
          <div class="sp-leak-banner__title">Внимание! Обнаружена утечка данных</div>
          <div class="sp-leak-banner__text">
            Ваш аккаунт мог быть скомпрометирован. Рекомендуем сменить пароль немедленно для защиты
            ваших данных.
          </div>
        </div>
        <UButton size="sm" color="error" variant="solid" @click="openChangePassword">
          Сменить пароль
        </UButton>
      </div>
    </Transition>

    <!-- Основной контент -->
    <div class="sp-body">
      <!-- Левая колонка — навигация -->
      <aside class="sp-sidebar">
        <nav class="sp-nav">
          <div v-for="item in navItems" :key="item.label" class="sp-nav__item">
            <span class="sp-nav__icon">{{ item.icon }}</span>
            <span class="sp-nav__label">{{ item.label }}</span>
            <span v-if="item.badge" class="sp-nav__badge">{{ item.badge }}</span>
          </div>
        </nav>
      </aside>

      <!-- Центральная колонка — лента / форма -->
      <main class="sp-feed">
        <!-- Модалка смены пароля -->
        <Transition name="form-fade">
          <div v-if="showForm" class="sp-form-overlay">
            <div class="sp-form-card">
              <div class="sp-form-card__header">
                <span>🔑 Смена пароля</span>
              </div>
              <ChangePasswordForm @submit="onFormSubmit" @dismiss="onFormDismiss" />
            </div>
          </div>
        </Transition>

        <!-- Профиль (мини-карточка) -->
        <div class="sp-profile-card">
          <div class="sp-profile-card__avatar">{{ user.avatar }}</div>
          <div class="sp-profile-card__info">
            <div class="sp-profile-card__name">{{ user.name }}</div>
            <div class="sp-profile-card__status">{{ user.status }}</div>
          </div>
          <div class="sp-profile-card__stats">
            <div class="sp-profile-card__stat">
              <span class="sp-profile-card__stat-num">{{ user.friends }}</span>
              <span class="sp-profile-card__stat-label">друзей</span>
            </div>
            <div class="sp-profile-card__stat">
              <span class="sp-profile-card__stat-num">{{ user.followers }}</span>
              <span class="sp-profile-card__stat-label">подписчиков</span>
            </div>
            <div class="sp-profile-card__stat">
              <span class="sp-profile-card__stat-num">{{ user.photos }}</span>
              <span class="sp-profile-card__stat-label">фото</span>
            </div>
          </div>
        </div>

        <!-- Лента постов -->
        <div class="sp-posts">
          <div v-for="post in posts" :key="post.id" class="sp-post">
            <div class="sp-post__header">
              <span class="sp-post__avatar">{{ post.authorAvatar }}</span>
              <div class="sp-post__meta">
                <span class="sp-post__author">{{ post.author }}</span>
                <span class="sp-post__time">{{ post.time }}</span>
              </div>
            </div>
            <p class="sp-post__text">{{ post.text }}</p>
            <div class="sp-post__actions">
              <span class="sp-post__action">❤️ {{ post.likes }}</span>
              <span class="sp-post__action">💬 {{ post.comments }}</span>
              <span class="sp-post__action">🔄 {{ post.reposts }}</span>
            </div>
          </div>
        </div>
      </main>

      <!-- Правая колонка — друзья онлайн -->
      <aside class="sp-right">
        <div class="sp-friends">
          <div class="sp-friends__title">
            Друзья онлайн
            <span class="sp-friends__count">{{ friends.filter((f) => f.online).length }}</span>
          </div>
          <div v-for="f in friends" :key="f.name" class="sp-friend">
            <span class="sp-friend__avatar">{{ f.avatar }}</span>
            <span class="sp-friend__name">{{ f.name }}</span>
            <span v-if="f.online" class="sp-friend__online" />
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style lang="scss">
.sp {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background: #edeef0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 13px;
  color: #222;
}

// ── Header ──────────────────────────────────────────
.sp-header {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #fff;
  padding: 0 24px;
  height: 48px;
  border-bottom: 1px solid #dce1e6;
  position: sticky;
  top: 0;
  z-index: 50;

  &__left {
    flex-shrink: 0;
  }

  &__logo {
    font-size: 16px;
    font-weight: 700;
    color: #2787f5;
    letter-spacing: -0.3px;
  }

  &__search {
    flex: 1;
    max-width: 320px;
  }

  &__input {
    width: 100%;
    height: 32px;
    border: 1px solid #dce1e6;
    border-radius: 8px;
    padding: 0 12px;
    font-size: 13px;
    background: #f0f2f5;
    outline: none;
    color: #626d7a;

    &:focus {
      border-color: #2787f5;
      background: #fff;
    }
  }

  &__right {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__user-avatar {
    font-size: 20px;
  }

  &__user-name {
    font-size: 13px;
    font-weight: 500;
    color: #2c2d2e;
  }
}

// ── Баннер утечки ───────────────────────────────────
.sp-leak-banner {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #fff4f4;
  border: 1px solid #fbc4c4;
  padding: 12px 24px;
  margin: 12px 24px 0;
  border-radius: 10px;

  &__icon {
    font-size: 28px;
    flex-shrink: 0;
  }

  &__body {
    flex: 1;
  }

  &__title {
    font-size: 14px;
    font-weight: 700;
    color: #c62828;
    margin-bottom: 2px;
  }

  &__text {
    font-size: 12.5px;
    color: #7f1d1d;
    line-height: 1.4;
  }
}

// ── Body (3 колонки) ────────────────────────────────
.sp-body {
  display: flex;
  gap: 16px;
  max-width: 1000px;
  margin: 16px auto 0;
  padding: 0 16px 24px;
  align-items: flex-start;
}

// ── Левая колонка ───────────────────────────────────
.sp-sidebar {
  width: 180px;
  flex-shrink: 0;
}

.sp-nav {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;

  &__item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 14px;
    cursor: pointer;
    transition: background 0.15s;
    position: relative;

    &:hover {
      background: #f0f2f5;
    }
  }

  &__icon {
    font-size: 16px;
    width: 22px;
    text-align: center;
    flex-shrink: 0;
  }

  &__label {
    font-size: 13px;
    color: #2c2d2e;
    font-weight: 400;
  }

  &__badge {
    margin-left: auto;
    background: #e64646;
    color: #fff;
    font-size: 11px;
    font-weight: 600;
    min-width: 18px;
    height: 18px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 5px;
  }
}

// ── Центральная колонка ─────────────────────────────
.sp-feed {
  flex: 1;
  min-width: 0;
  position: relative;
}

// ── Профиль-карточка ────────────────────────────────
.sp-profile-card {
  background: #fff;
  border-radius: 10px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;

  &__avatar {
    font-size: 40px;
    width: 52px;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0f2f5;
    border-radius: 50%;
    flex-shrink: 0;
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__name {
    font-size: 15px;
    font-weight: 700;
    color: #2c2d2e;
  }

  &__status {
    font-size: 12.5px;
    color: #818c99;
    margin-top: 2px;
  }

  &__stats {
    display: flex;
    gap: 16px;
    flex-shrink: 0;
  }

  &__stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1px;
  }

  &__stat-num {
    font-size: 15px;
    font-weight: 700;
    color: #2787f5;
  }

  &__stat-label {
    font-size: 11px;
    color: #818c99;
  }
}

// ── Посты ───────────────────────────────────────────
.sp-posts {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sp-post {
  background: #fff;
  border-radius: 10px;
  padding: 16px 20px;

  &__header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
  }

  &__avatar {
    font-size: 28px;
    width: 36px;
    height: 36px;
    background: #f0f2f5;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__meta {
    display: flex;
    flex-direction: column;
  }

  &__author {
    font-size: 13px;
    font-weight: 600;
    color: #2787f5;
  }

  &__time {
    font-size: 12px;
    color: #939cb0;
  }

  &__text {
    font-size: 13.5px;
    line-height: 1.45;
    color: #2c2d2e;
    margin: 0 0 12px;
  }

  &__actions {
    display: flex;
    gap: 18px;
    border-top: 1px solid #edeef0;
    padding-top: 10px;
  }

  &__action {
    font-size: 12.5px;
    color: #818c99;
    cursor: pointer;
    user-select: none;

    &:hover {
      color: #2787f5;
    }
  }
}

// ── Правая колонка — друзья ─────────────────────────
.sp-right {
  width: 200px;
  flex-shrink: 0;
}

.sp-friends {
  background: #fff;
  border-radius: 10px;
  padding: 14px 16px;

  &__title {
    font-size: 13px;
    font-weight: 600;
    color: #2c2d2e;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__count {
    font-size: 11px;
    color: #818c99;
    font-weight: 400;
  }
}

.sp-friend {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 0;
  cursor: pointer;

  &:hover &__name {
    color: #2787f5;
  }

  &__avatar {
    font-size: 20px;
    width: 28px;
    height: 28px;
    background: #f0f2f5;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__name {
    font-size: 12.5px;
    color: #2c2d2e;
    transition: color 0.15s;
  }

  &__online {
    margin-left: auto;
    width: 8px;
    height: 8px;
    background: #4bb34b;
    border-radius: 50%;
    flex-shrink: 0;
  }
}

// ── Форма смены пароля (оверлей) ────────────────────
.sp-form-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 60;
  padding-top: 40px;
}

.sp-form-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  width: 380px;
  overflow: hidden;

  &__header {
    background: #f7f8fa;
    padding: 14px 20px;
    font-size: 15px;
    font-weight: 600;
    color: #2c2d2e;
    border-bottom: 1px solid #edeef0;
  }
}

// ── Transitions ─────────────────────────────────────
.banner-slide-enter-active,
.banner-slide-leave-active {
  transition: all 0.35s ease;
}
.banner-slide-enter-from,
.banner-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

.form-fade-enter-active,
.form-fade-leave-active {
  transition: opacity 0.25s ease;
}
.form-fade-enter-from,
.form-fade-leave-to {
  opacity: 0;
}
</style>
