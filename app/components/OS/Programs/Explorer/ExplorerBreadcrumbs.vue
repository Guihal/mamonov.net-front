<script setup lang="ts">
const props = defineProps<{
  rootName: string
  currentPath: string[]
}>()

const emit = defineEmits<{
  navigateTo: [path: string[]]
}>()

const links = computed(() => {
  const result: { label: string; click: () => void }[] = [
    {
      label: props.rootName,
      click: () => emit('navigateTo', [])
    }
  ]

  props.currentPath.forEach((segment, i) => {
    const pathSlice = props.currentPath.slice(0, i + 1)
    result.push({
      label: segment,
      click: () => emit('navigateTo', pathSlice)
    })
  })

  return result
})
</script>

<template>
  <div class="explorer-breadcrumbs">
    <UBreadcrumb :items="links" />
  </div>
</template>

<style lang="scss">
.explorer-breadcrumbs {
  padding: 6px 12px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
  flex-shrink: 0;
}
</style>
