<script setup lang="ts">
const taskbar = ref<HTMLElement | null>(null)
const { setTaskbarObserver, setViewportObserver } = useContentArea()

setViewportObserver()
setTaskbarObserver(taskbar)

const { unFocus } = useFocusWindowController()

// Состояние меню «Пуск»
const isStartMenuOpen = ref(false)

const toggleStartMenu = () => {
  isStartMenuOpen.value = !isStartMenuOpen.value
}

const closeStartMenu = () => {
  isStartMenuOpen.value = false
}
</script>

<template>
  <nav ref="taskbar" class="taskbar">
    <div class="taskbar__bg" @click="unFocus" />

    <ul class="taskbar__list">
      <!-- Кнопка «Пуск» -->
      <li class="taskbar__start-wrapper">
        <button
          class="taskbar__el taskbar__start"
          :class="{ 'taskbar__start--active': isStartMenuOpen }"
          @click.stop="toggleStartMenu"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 1H9V3H7V1ZM5 3H7V5H5V3ZM9 3H11V5H9V3ZM3 5H5V7H3V5ZM11 5H13V7H11V5ZM1 7H3V9H1V7ZM13 7H15V9H13V7ZM1 9H3V11H1V9ZM13 9H15V11H13V9ZM3 11H5V13H3V11ZM11 11H13V13H11V11ZM5 13H7V15H5V13ZM9 13H11V15H9V13ZM7 11H9V13H7V11ZM5 7H7V9H5V7ZM9 7H11V9H9V7ZM7 5H9V7H7V5ZM7 9H9V11H7V9Z"
              fill="currentColor"
            />
          </svg>
        </button>

        <!-- Dropdown меню «Пуск» -->
        <Transition name="start-menu-fade">
          <div v-if="isStartMenuOpen" class="taskbar__start-menu" @click.stop>
            <OSTaskbarStartMenu @close="closeStartMenu" />
          </div>
        </Transition>
      </li>

      <!-- Программы -->
      <OSTaskbarAllPrograms />
    </ul>

    <!-- Wi-Fi трей (справа) -->
    <div class="taskbar__tray">
      <OSTaskbarWifiTray />
    </div>

    <!-- Клик за пределами меню — закрыть его -->
    <Teleport to="#__nuxt">
      <div v-if="isStartMenuOpen" class="taskbar__start-overlay" @click="closeStartMenu" />
    </Teleport>
  </nav>
</template>

<style lang="scss">
.taskbar {
  width: 100%;
  height: 44px;
  position: fixed;
  bottom: 0;
  left: 0;

  display: flex;
  align-items: center;

  z-index: 201;

  &__bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(12px);
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }

  &__list {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0 8px;
    gap: 2px;
    height: 100%;
    flex: 1;
  }

  &__tray {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    padding: 0 8px;
    height: 100%;
    margin-left: auto;
  }

  &__el {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: none;
    background: none;
    cursor: pointer;
    border-radius: 6px;
    color: #000;
    transition: background-color 0.15s ease;

    &:hover {
      background-color: rgba(0, 0, 0, 0.06);
    }
  }

  &__start {
    &--active {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }

  &__start-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  &__start-menu {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 0;
    z-index: 202;
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    padding: 4px;
    min-width: 160px;
  }

  &__start-overlay {
    position: fixed;
    inset: 0;
    z-index: 200;
  }
}

.start-menu-fade-enter-active,
.start-menu-fade-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.start-menu-fade-enter-from,
.start-menu-fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
