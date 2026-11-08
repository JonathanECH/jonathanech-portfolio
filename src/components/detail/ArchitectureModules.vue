<script setup lang="ts">
import { computed } from 'vue'
import { Activity, Check, Database, Layers } from '@lucide/vue'
import type { Component } from 'vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { useI18n } from '@/i18n'
import type { ModuleIcon, Project } from '@/types/portfolio'

const props = defineProps<{ project: Project }>()
const { t } = useI18n()

const accentStyle = computed<Record<string, string>>(() => ({
  '--project-accent': props.project.accent,
}))

const moduleIcons: Record<ModuleIcon, Component> = {
  reactivity: Layers,
  state: Activity,
  database: Database,
}

function moduleIcon(icon: ModuleIcon): Component {
  return moduleIcons[icon]
}

function formatCounter(index: number, total: number): string {
  return `${String(index + 1).padStart(2, '0')}/${String(total).padStart(2, '0')}`
}
</script>

<template>
  <section
    class="mx-auto w-full max-w-7xl px-5 pb-16 sm:px-6 sm:pb-20 lg:px-12"
    :aria-label="t('detail.architectureAria')"
    :style="accentStyle"
  >
    <div class="mb-8 flex items-center gap-3">
      <span
        class="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-accent/80 sm:text-[11px]"
      >
        {{ t('detail.architectureCode') }}
      </span>
      <span class="h-px flex-1 bg-border" aria-hidden="true" />
    </div>

    <SectionHeading
      code="// ARCHITECTURE // MODULES"
      :title="t('detail.architectureTitle')"
      :highlight="t('detail.architectureHighlight')"
      :description="t('detail.architectureDescription')"
    />

    <div class="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="(module, index) in project.modules"
        :key="module.code"
        class="group relative flex flex-col overflow-hidden rounded border border-border bg-surface-card/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-border-hover hover:bg-surface-card sm:p-6"
      >
        <span
          class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[color:var(--project-accent)]/70 via-[color:var(--project-accent)]/15 to-transparent"
          aria-hidden="true"
        />

        <div class="flex items-start justify-between gap-3">
          <span
            class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded border border-[color:var(--project-accent)]/25 bg-[color:var(--project-accent)]/10 text-[color:var(--project-accent)] transition-colors duration-300 group-hover:border-[color:var(--project-accent)]/50"
          >
            <component :is="moduleIcon(module.icon)" :size="18" aria-hidden="true" />
          </span>
          <span class="font-mono text-[10px] uppercase tracking-[0.18em] text-white/30">
            {{ t('detail.module', { counter: formatCounter(index, project.modules.length) }) }}
          </span>
        </div>

        <p
          class="mt-5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--project-accent)]"
        >
          {{ module.code }} // {{ module.title }}
        </p>

        <h3 class="mt-2 text-lg font-bold leading-snug tracking-[-0.02em] text-white">
          {{ module.subtitle }}
        </h3>

        <p class="mt-3 flex-1 text-sm leading-relaxed text-white/60">
          {{ module.description }}
        </p>

        <ul class="mt-5 space-y-2 border-t border-border pt-4">
          <li
            v-for="point in module.points"
            :key="point"
            class="flex items-start gap-2 font-mono text-[10px] leading-relaxed text-white/50 sm:text-[11px]"
          >
            <Check
              :size="12"
              aria-hidden="true"
              class="mt-0.5 shrink-0 text-[color:var(--project-accent)]/80"
            />
            <span>{{ point }}</span>
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>
