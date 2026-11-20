<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import ArchitectureModules from '@/components/detail/ArchitectureModules.vue'
import ChallengeAudit from '@/components/detail/ChallengeAudit.vue'
import ProjectGallery from '@/components/detail/ProjectGallery.vue'
import ProjectHeader from '@/components/detail/ProjectHeader.vue'
import ProjectPager from '@/components/detail/ProjectPager.vue'
import ProjectSpecs from '@/components/detail/ProjectSpecs.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { usePortfolioData } from '@/composables/usePortfolioData'
import { useI18n } from '@/i18n'

const NotFoundView = defineAsyncComponent(() => import('@/views/NotFoundView.vue'))

const props = defineProps<{ slug: string }>()

const { getProjectBySlug, getProjectNeighbors } = usePortfolioData()
const { t, locale } = useI18n()

const project = computed(() => getProjectBySlug(props.slug))
const neighbors = computed(() => getProjectNeighbors(props.slug))

const galleryCode = computed(() => t('detail.galleryCode'))
</script>

<template>
  <article v-if="project" class="relative">
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
        <ProjectGallery
          :key="`${project.slug}-${locale}`"
          :project="project"
        />
      </div>
    </section>

    <ChallengeAudit :project="project" />
    <ArchitectureModules :project="project" />
    <ProjectPager :previous="neighbors.previous" :next="neighbors.next" />
  </article>

  <NotFoundView v-else />
</template>
