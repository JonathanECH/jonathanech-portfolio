<script setup lang="ts">
import { computed } from 'vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { useI18n } from '@/i18n'
import { usePortfolioStore } from '@/stores/portfolio'
import ProjectCard from './ProjectCard.vue'
import ProjectQuickModal from './ProjectQuickModal.vue'

const store = usePortfolioStore()
const { content, t } = useI18n()
const projects = computed(() => content.value.projects)
const sectionCode = computed(() => t('projects.code'))
</script>

<template>
  <section id="proyectos" class="relative border-t border-border/60 bg-surface/20 py-20 sm:py-24 lg:py-28">
    <div class="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-12">
      <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          :code="sectionCode"
          :title="t('projects.title')"
          :highlight="t('projects.highlight')"
        />
        <p class="max-w-sm font-mono text-[11px] leading-relaxed text-muted md:text-right">
          {{ t('projects.intro') }}
        </p>
      </div>

      <div class="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ProjectCard
          v-for="(project, index) in projects"
          :key="project.slug"
          v-reveal="index * 80"
          :project="project"
          :index="index"
          @open-quick-view="store.openQuickView"
        />
      </div>
    </div>

    <ProjectQuickModal />
  </section>
</template>
