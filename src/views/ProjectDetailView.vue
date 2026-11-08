<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowLeft } from '@lucide/vue'
import ArchitectureModules from '@/components/detail/ArchitectureModules.vue'
import ChallengeAudit from '@/components/detail/ChallengeAudit.vue'
import ProjectGallery from '@/components/detail/ProjectGallery.vue'
import ProjectHeader from '@/components/detail/ProjectHeader.vue'
import ProjectPager from '@/components/detail/ProjectPager.vue'
import ProjectSpecs from '@/components/detail/ProjectSpecs.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { usePortfolioData } from '@/composables/usePortfolioData'
import { useI18n } from '@/i18n'

const props = defineProps<{ slug: string }>()

const { getProjectBySlug, getProjectNeighbors } = usePortfolioData()
const { t } = useI18n()

const project = computed(() => getProjectBySlug(props.slug))
const neighbors = computed(() => getProjectNeighbors(props.slug))

const galleryCode = computed(() => t('detail.galleryCode'))
</script>

<template>
  <div v-if="project" class="relative">
    <ProjectHeader :project="project" />
    <ProjectSpecs :project="project" />

    <section
      class="mx-auto w-full max-w-7xl px-5 pb-14 sm:px-6 sm:pb-16 lg:px-12"
      :aria-label="t('detail.galleryAria')"
    >
      <SectionHeading
        :code="galleryCode"
        :title="t('detail.galleryTitle')"
        :highlight="t('detail.galleryHighlight')"
        :description="project.galleryDescription"
      />
      <div class="mt-8">
        <ProjectGallery :project="project" />
      </div>
    </section>

    <ChallengeAudit :project="project" />
    <ArchitectureModules :project="project" />
    <ProjectPager :previous="neighbors.previous" :next="neighbors.next" />
  </div>

  <section
    v-else
    class="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col items-start justify-center px-5 py-24 sm:px-6"
  >
    <p class="font-mono text-[11px] uppercase tracking-[0.24em] text-cyan-accent">
      {{ t('detail.notFoundCode') }}
    </p>
    <h1 class="mt-5 font-sans text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
      {{ t('detail.notFoundTitle') }}<span class="text-cyan-accent">.</span>
    </h1>
    <p class="mt-5 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
      {{ t('detail.notFoundDescription') }}
    </p>
    <RouterLink
      :to="{ path: '/', hash: '#proyectos' }"
      class="mt-8 inline-flex items-center gap-2 rounded-lg bg-cyan-accent px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.14em] text-black transition-all hover:shadow-[0_0_20px_rgba(var(--ech-accent-rgb),0.45)]"
    >
      <ArrowLeft :size="16" aria-hidden="true" />
      {{ t('detail.backToProjects') }}
    </RouterLink>
  </section>
</template>
