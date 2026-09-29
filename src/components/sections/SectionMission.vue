<script setup lang="ts">
import type { MessageSchema } from '../../locales/schema'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { LangMissionBluefinImageURL } from '../../content'
import { renderMarkdown } from '../../utils/markdown'

import SceneContent from '../common/SceneContent.vue'
import SceneQuote from '../common/SceneQuote.vue'
import SceneVisibilityChecker from '../common/SceneVisibilityChecker.vue'

const vis = ref(false)
const { t } = useI18n<MessageSchema>({
  useScope: 'global'
})
</script>

<template>
  <section id="scene-mission" class="section-wrap">
    <img src="/layer-transition.webp" class="layer-transition" alt="">

    <div class="container">
      <SceneContent
        tag="Mission.Tag"
        title="Mission.Title"
        text="Mission.Text.NewBreed"
        @visible="vis = true"
      >
        <p
          v-html="renderMarkdown(t('Mission.Text.Change'))"
        />
        <p
          v-html="renderMarkdown(t('Mission.Text.CloudNative'))"
        />
        <p
          v-html="renderMarkdown(t('Mission.Text.Sustainability'))"
        />
        <SceneQuote
          quote="SpreadQuote.Quote"
          author="SpreadQuote.Author"
          link="SpreadQuote.WikiLink"
        />
        <div
          v-html="renderMarkdown(t('Mission.CleverGirl'))"
        />
      </SceneContent>

      <Transition name="fade">
        <div v-if="vis" class="img-wrap">
          <img
            class="container"
            :src="LangMissionBluefinImageURL"
            :alt="t('Mission.BluefinChillAlt')"
          >
        </div>
      </Transition>
    </div>
    <SceneVisibilityChecker name="#scene-mission" />
  </section>
</template>
