<script setup lang="ts">
import { useOsIsolated } from '~/composables/os/useOsIsolated'

const emit = defineEmits<{ close: [] }>()
const route = useRoute()
const router = useRouter()

const onExit = () => {
  const { setIsolated } = useOsIsolated()
  setIsolated(false)

  const categorySlug = route.params.categorySlug as string | undefined
  const target = categorySlug ? `/app/categories/${categorySlug}` : '/app'

  emit('close')
  router.push(target)
}
</script>

<template>
  <div class="start-menu">
    <button class="start-menu__btn" @click="onExit">
      <svg
        class="start-menu__icon"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 1H9V3H7V1ZM5 3H7V5H5V3ZM9 3H11V5H9V3ZM3 5H5V7H3V5ZM11 5H13V7H11V5ZM1 7H3V9H1V7ZM13 7H15V9H13V7ZM1 9H3V11H1V9ZM13 9H15V11H13V9ZM3 11H5V13H3V11ZM11 11H13V13H11V11ZM5 13H7V15H5V13ZM9 13H11V15H9V13ZM7 11H9V13H7V11ZM5 7H7V9H5V7ZM9 7H11V9H9V7ZM7 5H9V7H7V5ZM7 9H9V11H7V9Z"
          fill="currentColor"
        />
      </svg>
      Выйти
    </button>
  </div>
</template>

<style lang="scss">
.start-menu {
  display: flex;
  flex-direction: column;
  min-width: 140px;

  &__btn {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 8px 12px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 13px;
    color: inherit;
    text-align: left;
    border-radius: 4px;
    transition: background-color 0.15s ease;

    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }
  }

  &__icon {
    flex-shrink: 0;
  }
}
</style>
