<script setup lang="ts">
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { projects } from '@/data/portfolio'
import { usePortfolioStore } from '@/stores/portfolio'
import ProjectCard from './ProjectCard.vue'
import ProjectQuickModal from './ProjectQuickModal.vue'

const store = usePortfolioStore()
const sectionCode = '// SELECTED_WORK // CASE_STUDIES'
</script>

<template>
  <section id="proyectos" class="relative border-t border-border/60 bg-surface/20 py-20 sm:py-24 lg:py-28">
    <div class="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-12">
      <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading :code="sectionCode" title="Ingeniería en" highlight="Práctica" />
        <p class="max-w-sm font-mono text-[11px] leading-relaxed text-muted md:text-right">
          Arquitecturas desplegadas con foco en integridad transaccional, rendimiento y diseño
          reactivo.
        </p>
      </div>

      <div class="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ProjectCard
          v-for="(project, index) in projects"
          :key="project.slug"
          :project="project"
          :index="index"
          @open-quick-view="store.openQuickView"
        />
      </div>
    </div>

    <ProjectQuickModal />
  </section>
</template>
