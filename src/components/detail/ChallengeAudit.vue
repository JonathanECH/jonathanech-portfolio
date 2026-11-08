<script setup lang="ts">
import { computed } from 'vue'
import { ArrowRight, CircleCheck, ShieldCheck } from '@lucide/vue'
import { useI18n } from '@/i18n'
import type { Project } from '@/types/portfolio'

const props = defineProps<{ project: Project }>()
const { t } = useI18n()

const accentStyle = computed<Record<string, string>>(() => ({
  '--project-accent': props.project.accent,
}))
</script>

<template>
  <section
    class="mx-auto w-full max-w-7xl px-5 pb-14 sm:px-6 sm:pb-16 lg:px-12"
    aria-labelledby="challenge-title"
    :style="accentStyle"
  >
    <div class="mb-8 flex items-center gap-3">
      <span
        class="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-cyan-accent/80 sm:text-[11px]"
      >
        {{ t('detail.challengeCode') }}
      </span>
      <span class="h-px flex-1 bg-border" aria-hidden="true" />
    </div>

    <div class="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
      <div class="lg:col-span-6">
        <h2
          id="challenge-title"
          class="text-2xl font-bold tracking-[-0.03em] text-white sm:text-3xl"
        >
          {{ t('detail.challengeTitle') }}
          <span class="text-cyan-accent">{{ t('detail.challengeHighlight') }}</span>
        </h2>

        <p class="mt-4 text-sm leading-relaxed text-white/65 sm:text-[15px]">
          {{ project.challenge.intro }}
        </p>

        <ol class="mt-7 space-y-4">
          <li
            v-for="(finding, index) in project.challenge.findings"
            :key="finding"
            class="flex gap-4 border-t border-border pt-4"
          >
            <span
              class="mt-0.5 font-mono text-[11px] font-semibold text-[color:var(--project-accent)]"
              aria-hidden="true"
            >
              0{{ index + 1 }}
            </span>
            <p class="text-sm leading-relaxed text-white/70">
              {{ finding }}
            </p>
          </li>
        </ol>
      </div>

      <div class="lg:col-span-6">
        <div
          class="relative overflow-hidden rounded border border-border bg-surface-card/60 p-5 sm:p-6 lg:p-7"
        >
          <span
            class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[color:var(--project-accent)]/70 via-[color:var(--project-accent)]/15 to-transparent"
            aria-hidden="true"
          />

          <div
            class="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4"
          >
            <h3
              class="inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--project-accent)] sm:text-[11px]"
            >
              <ShieldCheck :size="15" aria-hidden="true" />
              {{ t('detail.auditReport') }}
            </h3>
            <span class="font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
              {{ t('detail.audit', { year: project.year }) }}
            </span>
          </div>

          <div class="space-y-5 pt-5">
            <div>
              <p
                class="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-danger-soft/80"
              >
                <span class="h-1.5 w-1.5 rounded-full bg-danger-soft/80" aria-hidden="true" />
                {{ t('detail.diagnosis') }}
              </p>
              <p
                class="rounded bg-surface-card-hover/50 p-3 font-mono text-[11px] leading-relaxed text-white/70"
              >
                {{ project.audit.diagnosis }}
              </p>
            </div>

            <div>
              <p
                class="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--project-accent)]"
              >
                <span
                  class="h-1.5 w-1.5 rounded-full bg-[color:var(--project-accent)]"
                  aria-hidden="true"
                />
                {{ t('detail.resolution') }}
              </p>
              <p
                class="rounded bg-surface-card-hover/50 p-3 font-mono text-[11px] leading-relaxed text-white/60"
              >
                {{ project.audit.resolution }}
              </p>
            </div>

            <div class="grid grid-cols-1 gap-2 border-t border-border pt-5 sm:grid-cols-3">
              <div class="rounded border border-border bg-surface/70 px-3 py-3">
                <p class="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
                  {{ t('detail.latencyBefore') }}
                </p>
                <p class="mt-1.5 font-mono text-sm font-semibold text-danger-soft/80">
                  {{ project.audit.latencyBefore }}
                </p>
              </div>

              <div
                class="rounded border border-[color:var(--project-accent)]/30 bg-[color:var(--project-accent)]/10 px-3 py-3"
              >
                <p
                  class="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted"
                >
                  <ArrowRight
                    :size="10"
                    aria-hidden="true"
                    class="text-[color:var(--project-accent)]"
                  />
                  {{ t('detail.postRefactor') }}
                </p>
                <p class="mt-1.5 font-mono text-sm font-semibold text-[color:var(--project-accent)]">
                  {{ project.audit.latencyAfter }}
                </p>
                <p class="mt-0.5 font-mono text-[9px] text-white/40">
                  {{ project.audit.latencyDelta }}
                </p>
              </div>

              <div class="rounded border border-border bg-surface/70 px-3 py-3">
                <p class="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
                  {{ t('detail.discrepancy') }}
                </p>
                <p class="mt-1.5 font-mono text-sm font-semibold text-white">
                  {{ project.audit.discrepancy }}
                </p>
              </div>
            </div>

            <p class="flex items-start gap-2 font-mono text-[10px] leading-relaxed text-white/45">
              <CircleCheck
                :size="13"
                aria-hidden="true"
                class="mt-0.5 shrink-0 text-[color:var(--project-accent)]/80"
              />
              <span>{{ project.audit.consistencyNote }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
