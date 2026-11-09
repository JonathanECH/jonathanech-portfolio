<script setup lang="ts">
import { computed } from 'vue'
import { FileText, Gauge, MapPin, Terminal } from '@lucide/vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { useI18n } from '@/i18n'

const { content, t } = useI18n()
const profile = computed(() => content.value.profile)
const sectionCode = computed(() => t('about.code'))
</script>

<template>
  <section id="sobre-mi" class="relative border-t border-border/60 py-20 sm:py-24 lg:py-28">
    <div class="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-12">
      <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          :code="sectionCode"
          :title="t('about.title')"
          :highlight="t('about.highlight')"
        />
        <p class="max-w-sm font-mono text-[11px] leading-relaxed text-muted md:text-right">
          {{ profile.role }} // {{ profile.education }} // {{ profile.location }}
        </p>
      </div>

      <div class="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <!-- Editor window -->
        <div class="lg:col-span-7">
          <div class="h-full overflow-hidden rounded-2xl border border-border bg-surface-card/60">
            <div class="flex items-center gap-3 border-b border-border bg-background/60 px-4 py-3">
              <div class="flex items-center gap-1.5" aria-hidden="true">
                <span class="h-2.5 w-2.5 rounded-full bg-traffic-close/80" />
                <span class="h-2.5 w-2.5 rounded-full bg-traffic-minimize/80" />
                <span class="h-2.5 w-2.5 rounded-full bg-traffic-maximize/80" />
              </div>
              <div class="flex min-w-0 flex-1 items-center gap-1.5 font-mono text-[10px] text-muted">
                <Terminal :size="12" class="shrink-0 text-cyan-accent" aria-hidden="true" />
                <span class="truncate">{{ profile.philosophyPath }}</span>
              </div>
              <span class="hidden shrink-0 font-mono text-[9px] uppercase tracking-[0.16em] text-muted/70 sm:block">
                UTF-8
              </span>
            </div>

            <div class="p-5 sm:p-7">
              <p class="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-accent/80">
                {{ t('about.bioLabel') }}
              </p>

              <p
                class="mt-4 border-l-2 border-cyan-accent/40 pl-4 text-sm leading-relaxed text-foreground/80 sm:text-[15px]"
              >
                {{ profile.bio }}
              </p>

              <p
                class="mt-4 border-l-2 border-cyan-accent/20 pl-4 text-sm leading-relaxed text-muted sm:text-[15px]"
              >
                {{ profile.bioAi }}
              </p>

              <div class="mt-6 grid grid-cols-3 gap-2.5 sm:gap-3">
                <div
                  v-for="stat in profile.stats"
                  :key="stat.label"
                  class="rounded-lg border border-border bg-background/40 px-2.5 py-3 sm:px-3"
                >
                  <p class="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                    {{ stat.label }}
                  </p>
                  <p class="mt-1 truncate font-sans text-xs font-semibold text-foreground sm:text-sm">
                    {{ stat.value }}
                  </p>
                </div>
              </div>

              <div
                class="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border/60 pt-4 font-mono text-[10px] text-muted"
              >
                <span class="inline-flex items-center gap-1.5">
                  <MapPin :size="12" class="shrink-0 text-cyan-accent" aria-hidden="true" />
                  {{ profile.location }}
                </span>
                <span class="inline-flex items-center gap-1.5">
                  <FileText :size="12" class="shrink-0 text-cyan-accent" aria-hidden="true" />
                  {{ profile.education }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Performance + environment panels -->
        <div class="flex flex-col gap-6 lg:col-span-5">
          <div class="rounded-2xl border border-border bg-surface-card/60 p-5 transition-colors duration-300 hover:border-border-hover sm:p-6">
            <div class="flex items-center gap-2.5">
              <span
                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background/60 text-cyan-accent"
              >
                <Gauge :size="16" aria-hidden="true" />
              </span>
              <div>
                <h3 class="font-sans text-sm font-semibold text-foreground">
                  {{ t('about.performanceTitle') }}
                </h3>
                <p class="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
                  {{ t('about.performanceCode') }}
                </p>
              </div>
            </div>

            <ul class="mt-5 space-y-3.5">
              <li v-for="metric in profile.performance" :key="metric.label">
                <div
                  class="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.14em]"
                >
                  <span class="text-muted">{{ metric.label }}</span>
                  <span class="text-foreground">
                    {{ metric.value }}<span class="text-muted">/100</span>
                  </span>
                </div>
                <div
                  class="mt-1.5 h-1.5 overflow-hidden rounded-full bg-foreground/10"
                  role="progressbar"
                  :aria-label="metric.label"
                  :aria-valuenow="metric.value"
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <div
                    class="h-full rounded-full bg-gradient-to-r from-cyan-accent/50 to-cyan-accent"
                    :style="{ width: `${metric.value}%` }"
                  />
                </div>
              </li>
            </ul>
          </div>

          <div
            class="flex flex-1 flex-col rounded-2xl border border-border bg-surface-card/60 p-5 transition-colors duration-300 hover:border-border-hover sm:p-6"
          >
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-2.5">
                <span
                  class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background/60 text-cyan-accent"
                >
                  <Terminal :size="16" aria-hidden="true" />
                </span>
                <div>
                  <h3 class="font-sans text-sm font-semibold text-foreground">
                    {{ t('about.environmentTitle') }}
                  </h3>
                  <p class="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">
                    {{ t('about.environmentCode') }}
                  </p>
                </div>
              </div>
              <span
                class="inline-flex shrink-0 items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-cyan-accent"
              >
                <span class="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-cyan-accent" />
                {{ t('about.live') }}
              </span>
            </div>

            <dl class="mt-4 divide-y divide-border/60 font-mono text-[11px]">
              <div
                v-for="item in profile.environment"
                :key="item.label"
                class="flex items-center justify-between gap-4 py-2.5"
              >
                <dt class="shrink-0 text-[9px] uppercase tracking-[0.16em] text-muted">
                  {{ item.label }}
                </dt>
                <dd class="truncate text-right text-foreground/80">{{ item.value }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
