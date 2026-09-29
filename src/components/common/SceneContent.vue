<script setup lang="ts">
import type { MessageSchema } from '../../locales/schema'
import { useElementVisibility, watchOnce } from '@vueuse/core'
import { ref } from 'vue'

import { useI18n } from 'vue-i18n'
import { renderMarkdown } from '../../utils/markdown'

const props = defineProps<{
  tag: string
  title: string
  text: string
  disableAnimation?: boolean
}>()

const emit = defineEmits<{
  visible: []
}>()

// Trigger only once
const wrapper = ref<HTMLDivElement>()
const isVisible = useElementVisibility(wrapper)
const fired = ref(false)

if (props.disableAnimation) {
  fired.value = true
}

watchOnce(isVisible, () => {
  fired.value = true

  setTimeout(() => {
    emit('visible')
  }, 50)
})
const { t } = useI18n<MessageSchema>({
  useScope: 'global'
})
</script>

<template>
  <div ref="wrapper" class="scene-content" :class="{ visible: fired }">
    <div>
      <strong>{{ t(props.tag) }}</strong>
    </div>
    <div>
      <h2>
        {{ t(props.title) }}
      </h2>
    </div>
    <div>
      <div>
        <p v-html="renderMarkdown(t(props.text) ?? '')" />
        <slot />
      </div>
    </div>
  </div>
</template>
