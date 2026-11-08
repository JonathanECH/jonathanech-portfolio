<script setup lang="ts">
import { computed } from 'vue'
import { ArrowRight, ArrowUpRight, Check, Copy, Send } from '@lucide/vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import SocialIcon from '@/components/ui/SocialIcon.vue'
import { useClipboard } from '@/composables/useClipboard'
import { useI18n } from '@/i18n'

const { copy, isCopied } = useClipboard()
const { content, t } = useI18n()
const contactChannels = computed(() => content.value.contactChannels)
const sectionCode = computed(() => t('contact.code'))

function copyEmail(value: string): void {
  void copy(value, 'email')
}
</script>

<template>
  <section id="contacto" class="relative border-t border-border/60 py-20 sm:py-24 lg:py-28">
    <div class="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-12">
      <div class="relative overflow-hidden rounded-2xl border border-border bg-surface/40 p-6 sm:p-10 lg:p-14">
        <div
          class="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-accent/10 blur-3xl"
          aria-hidden="true"
        />
        <div class="pointer-events-none absolute inset-0 bg-grid-fine opacity-40" aria-hidden="true" />

        <div class="relative">
          <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              :code="sectionCode"
              :title="t('contact.title')"
              :highlight="t('contact.highlight')"
            />
            <p class="max-w-sm text-sm leading-relaxed text-muted md:text-right">
              {{ t('contact.intro') }}
            </p>
          </div>

          <div class="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <article
              v-for="channel in contactChannels"
              :key="channel.id"
              class="group relative flex flex-col rounded-xl border border-border bg-surface-card/70 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-border-hover hover:shadow-[0_16px_32px_-24px_rgba(var(--ech-accent-rgb),0.5)]"
            >
              <div class="flex items-start justify-between gap-3">
                <span
                  class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background/60 text-cyan-accent transition-colors group-hover:border-border-hover"
                >
                  <SocialIcon :name="channel.icon" :size="18" />
                </span>
                <span
                  class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border text-muted transition-colors group-hover:border-border-hover group-hover:text-cyan-accent"
                  aria-hidden="true"
                >
                  <ArrowUpRight v-if="channel.external" :size="14" />
                  <ArrowRight v-else :size="14" />
                </span>
              </div>

              <h3 class="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                {{ channel.label }}
              </h3>
              <p class="mt-1 break-words font-mono text-sm text-foreground">{{ channel.value }}</p>
              <p class="mt-2 text-xs leading-relaxed text-muted">{{ channel.description }}</p>

              <div class="mt-auto pt-4">
                <span
                  class="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.16em] text-cyan-accent"
                >
                  {{ channel.actionLabel }}
                </span>

                <button
                  v-if="channel.copyValue"
                  type="button"
                  class="relative z-10 mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-border bg-background/60 px-2.5 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted transition-colors hover:border-border-hover hover:text-cyan-accent"
                  @click.stop="copyEmail(channel.copyValue ?? channel.value)"
                >
                  <Check v-if="isCopied('email')" :size="12" aria-hidden="true" />
                  <Copy v-else :size="12" aria-hidden="true" />
                  <span aria-live="polite" aria-atomic="true">
                    {{ isCopied('email') ? t('contact.copied') : t('contact.copyEmail') }}
                  </span>
                </button>
              </div>

              <!-- Stretched link: card opens the channel -->
              <a
                :href="channel.href"
                :target="channel.external ? '_blank' : undefined"
                :rel="channel.external ? 'noopener noreferrer' : undefined"
                class="absolute inset-0 z-0 rounded-xl focus-visible:bg-cyan-accent/5 focus-visible:outline-offset-[-2px]"
                :aria-label="
                  channel.external
                    ? t('contact.externalAria', {
                        action: channel.actionLabel,
                        value: channel.value,
                      })
                    : `${channel.actionLabel}: ${channel.value}`
                "
              />
            </article>
          </div>

          <div
            class="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted"
          >
            <span class="inline-flex items-center gap-2">
              <Send :size="12" class="shrink-0 text-cyan-accent" aria-hidden="true" />
              {{ t('contact.transmission') }}
            </span>
            <span class="text-muted/70">{{ t('contact.response') }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
