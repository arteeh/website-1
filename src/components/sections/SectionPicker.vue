<script setup lang="ts">
import type { MessageSchema } from '../../locales/schema'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { getDakotaVersions } from '../../composables'

import { renderMarkdownInline } from '../../utils/markdown'
import ProductVersionCard from '../common/ProductVersionCard.vue'
import SceneVisibilityChecker from '../common/SceneVisibilityChecker.vue'

const { t } = useI18n<MessageSchema>({
  useScope: 'global'
})

const dakotaVersions = ref<Awaited<ReturnType<typeof getDakotaVersions>> | null>(null)

// Labels mirror DakotaVersionChips.vue so every surface names a package the same way.
const PACKAGE_LABELS: Record<string, string> = {
  kernel: 'Kernel',
  gnome: 'GNOME',
  mesa: 'Mesa',
  systemd: 'systemd',
  pipewire: 'PipeWire',
  bootc: 'bootc',
  nvidia: 'NVidia Driver'
}

// Kernel/init first, then graphics, then desktop. Every key here must be
// resolvable from the image SBOM — see scripts/lib/image-sbom-registry.js.
const DAKOTA_KEYS = ['kernel', 'systemd', 'bootc', 'mesa', 'nvidia', 'gnome', 'pipewire']

async function loadVersions() {
  try {
    dakotaVersions.value = await getDakotaVersions()
  }
  catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[SectionPicker] failed to load Dakota versions', error)
    }
  }
}

const dakotaRows = computed(() => {
  const v = dakotaVersions.value
  if (!v?.packages || v.status !== 'verified') {
    return []
  }
  const packages = v.packages
  return DAKOTA_KEYS
    .filter(key => packages[key])
    .map(key => ({ label: PACKAGE_LABELS[key] ?? key, value: packages[key] }))
})

const downloads = computed(() => [
  {
    title: t('TryBluefin.Wolves.Cards.Dakota'),
    description: t('TryBluefin.Wolves.Cards.DakotaDescription'),
    href: '/dakota/',
    image: 'characters/dakota.webp',
    badgeTitle: t('TryBluefin.Wolves.Cards.AlphaBadge'),
    badgeSub: t('TryBluefin.Wolves.Cards.AlphaBadgeSub'),
    versionRows: dakotaRows.value
  },
  {
    title: t('TryBluefin.Wolves.Cards.Server'),
    description: t('TryBluefin.Wolves.Cards.ServerDescription'),
    href: '/server/',
    image: 'characters/alamosaurus.webp',
    badgeTitle: t('TryBluefin.Wolves.Cards.AlphaBadge'),
    badgeSub: t('TryBluefin.Wolves.Cards.AlphaBadgeSub'),
    versionRows: []
  },
  {
    title: t('TryBluefin.Wolves.Cards.Utah'),
    description: t('TryBluefin.Wolves.Cards.UtahDescription'),
    href: 'https://github.com/projectbluefin/utah',
    image: 'characters/utah.webp',
    badgeTitle: t('TryBluefin.Wolves.Cards.ComingSoonBadge'),
    versionRows: []
  }
])

onMounted(loadVersions)
</script>

<template>
  <section id="scene-picker" class="section-wrap">
    <div class="container">
      <div class="picker-header">
        <div class="picker-tag">
          <strong>{{ t("TryBluefin.Tag") }}</strong>
        </div>
        <h2>{{ t("TryBluefin.Title") }}</h2>
      </div>
      <p
        class="legacy-download-note"
        v-html="renderMarkdownInline(t('TryBluefin.LegacyDownloads'))"
      />

      <div class="wolves-download-grid">
        <ProductVersionCard
          v-for="download in downloads"
          :key="download.title"
          :title="download.title"
          :description="download.description"
          :image="download.image"
          :href="download.href"
          :badge-title="download.badgeTitle"
          :badge-sub="download.badgeSub"
          :version-rows="download.versionRows"
        />
      </div>
    </div>
    <SceneVisibilityChecker name="#scene-picker" />
  </section>
</template>

<style scoped lang="scss">
@use '../../style/setup/fonts';

.legacy-download-note :deep(a) {
  @include fonts.font(700);
  color: var(--color-blue-light);

  &:hover {
    text-decoration: none;
  }
}

.wolves-download-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

@media (max-width: 956px) {
  .wolves-download-grid {
    grid-template-columns: 1fr;
  }
}
</style>
