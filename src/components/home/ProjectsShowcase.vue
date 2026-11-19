<script setup lang="ts">
import { computed, ref } from 'vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { useI18n } from '@/i18n'
import { usePortfolioStore } from '@/stores/portfolio'
import ProjectCard from './ProjectCard.vue'
import ProjectQuickModal from './ProjectQuickModal.vue'

const store = usePortfolioStore()
const { content, t } = useI18n()
const projects = computed(() => content.value.projects)
const sectionCode = computed(() => t('projects.code'))

const activeFilter = ref<string>('all')

const filterOptions = computed(() => [
  { id: 'all', label: t('projects.filterAll') },
  { id: 'vue', label: 'Vue 3', tag: 'Vue 3' },
  { id: 'angular', label: 'Angular 19', tag: 'Angular' },
  { id: 'typescript', label: 'TypeScript', tag: 'TypeScript' },
  { id: 'node', label: 'Node.js', tag: 'Node.js' },
  { id: 'postgresql', label: 'PostgreSQL', tag: 'PostgreSQL' },
])

const filteredProjects = computed(() => {
  if (activeFilter.value === 'all') return projects.value
  const opt = filterOptions.value.find((o) => o.id === activeFilter.value)
  if (!opt?.tag) return projects.value
  return projects.value.filter((project) =>
    project.techTags.some((tag) => tag.toLowerCase().includes(opt.tag.toLowerCase())),
  )
})
</script>

<template>
  <section
    id="proyectos"
    class="deferred-section relative border-t border-border/60 bg-surface/20 py-20 sm:py-24 lg:py-28"
  >
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

      <!-- Tech filters -->
      <div
        class="mt-8 flex flex-wrap items-center gap-2"
        role="group"
        :aria-label="t('projects.filterLabel')"
      >
        <button
          v-for="opt in filterOptions"
          :key="opt.id"
          type="button"
          :aria-pressed="activeFilter === opt.id"
          class="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-all duration-200"
          :class="
            activeFilter === opt.id
              ? 'border-cyan-accent bg-cyan-accent/10 text-cyan-accent shadow-[0_0_15px_rgba(var(--ech-accent-rgb),0.15)]'
              : 'border-border/70 bg-surface-card/60 text-muted hover:border-border-hover hover:text-foreground'
          "
          @click="activeFilter = opt.id"
        >
          <span>{{ opt.label }}</span>
        </button>
      </div>

      <ul class="mt-8 grid list-none grid-cols-1 gap-6 overflow-x-clip md:grid-cols-2 lg:grid-cols-3">
        <ProjectCard
          v-for="project in filteredProjects"
          :key="project.slug"
          :project="project"
          @open-quick-view="store.openQuickView"
        />
      </ul>

      <div
        v-if="filteredProjects.length === 0"
        class="mt-12 rounded-xl border border-dashed border-border p-8 text-center"
      >
        <p class="font-mono text-xs text-muted">{{ t('projects.emptyFiltered') }}</p>
      </div>
    </div>

    <ProjectQuickModal />
  </section>
</template>
