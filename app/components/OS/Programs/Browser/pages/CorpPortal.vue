<script setup lang="ts">
const announcements = [
  {
    id: 1,
    title: 'Обновление политики безопасности',
    date: '01.04.2026',
    text: 'Уважаемые сотрудники! Просим ознакомиться с обновлённой политикой информационной безопасности компании.'
  },
  {
    id: 2,
    title: 'Плановое обслуживание серверов',
    date: '28.03.2026',
    text: 'В субботу 04.04.2026 с 22:00 до 02:00 будет проведено плановое обслуживание серверов. Возможны кратковременные перебои.'
  },
  {
    id: 3,
    title: 'Тренинг по кибербезопасности',
    date: '25.03.2026',
    text: 'Напоминаем о прохождении обязательного тренинга по кибербезопасности до конца месяца.'
  }
]

const contacts = [
  { name: 'IT-поддержка', email: 'support@corp.local', phone: '1234' },
  { name: 'Отдел безопасности', email: 'security@corp.local', phone: '1235' },
  { name: 'HR-отдел', email: 'hr@corp.local', phone: '1236' }
]
</script>

<template>
  <div class="corp-portal">
    <header class="corp-portal__header">
      <UIcon name="i-lucide-building" class="corp-portal__header-icon" />
      <h1 class="corp-portal__header-title">Корпоративный портал</h1>
    </header>

    <div class="corp-portal__body">
      <section class="corp-portal__section">
        <h2 class="corp-portal__section-title">Объявления</h2>
        <div class="corp-portal__announcements">
          <div v-for="a in announcements" :key="a.id" class="corp-portal__announcement">
            <div class="corp-portal__announcement-header">
              <span class="corp-portal__announcement-title">{{ a.title }}</span>
              <span class="corp-portal__announcement-date">{{ a.date }}</span>
            </div>
            <p class="corp-portal__announcement-text">{{ a.text }}</p>
          </div>
        </div>
      </section>

      <section class="corp-portal__section">
        <h2 class="corp-portal__section-title">Контакты</h2>
        <div class="corp-portal__contacts">
          <div v-for="c in contacts" :key="c.name" class="corp-portal__contact">
            <div class="corp-portal__contact-name">{{ c.name }}</div>
            <div class="corp-portal__contact-info">{{ c.email }} · вн. {{ c.phone }}</div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="scss">
.corp-portal {
  width: 100%;
  height: 100%;
  overflow-y: auto;

  &__header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px 24px;
    background: #1e40af;
    color: #ffffff;
  }

  &__header-icon {
    width: 28px;
    height: 28px;
  }

  &__header-title {
    font-size: 20px;
    font-weight: 600;
  }

  &__body {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  &__section-title {
    font-size: 16px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e5e7eb;
  }

  &__announcements {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__announcement {
    padding: 12px 16px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #f9fafb;
  }

  &__announcement-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }

  &__announcement-title {
    font-weight: 500;
    color: #1f2937;
    font-size: 14px;
  }

  &__announcement-date {
    font-size: 12px;
    color: #9ca3af;
  }

  &__announcement-text {
    font-size: 13px;
    color: #4b5563;
    line-height: 1.5;
  }

  &__contacts {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__contact {
    padding: 10px 16px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #f9fafb;
  }

  &__contact-name {
    font-weight: 500;
    font-size: 14px;
    color: #1f2937;
  }

  &__contact-info {
    font-size: 12px;
    color: #6b7280;
    margin-top: 2px;
  }
}
</style>
