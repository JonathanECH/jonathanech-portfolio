<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowRight, ExternalLink, X } from '@lucide/vue'
import { useLocalizedPath } from '@/composables/useLocalizedPath'
import { useScrollLock } from '@/composables/useScrollLock'
import { useI18n } from '@/i18n'
import { usePortfolioStore } from '@/stores/portfolio'

const store = usePortfolioStore()
const { t } = useI18n()
const { projectPath } = useLocalizedPath()

const dialogRef = ref<HTMLDialogElement | null>(null)
const open = computed(() => store.isQuickViewOpen)
const project = computed(() => store.quickViewProject)

useScrollLock(open)

watch(
  open,
  async (isOpen) => {
    if (!isOpen) {
      return
    }

    await nextTick()
    const dialog = dialogRef.value
    if (dialog && !dialog.open) {
      dialog.showModal()
    }
  },
  { immediate: true, flush: 'post' },
)

function close(): void {
  store.closeQuickView()
}

function handleCancel(event: Event): void {
  // Let the leave transition finish before the native dialog closes.
  event.preventDefault()
  close()
}

function handleAfterLeave(): void {
  const dialog = dialogRef.value
  if (dialog?.open && !open.value) {
    dialog.close()
  }
}

function handleNativeClose(): void {
  // Keeps state in sync if the browser closes the dialog by another path.
  if (open.value) {
    close()
  }
}
</script>

<template>
  <Teleport to="body">
    <dialog
      ref="dialogRef"
      class="quick-view-dialog"
      aria-labelledby="quick-view-title"
      aria-describedby="quick-view-summary"
      @cancel="handleCancel"
      @close="handleNativeClose"
      @click.self="close"
    >
      <Transition name="modal" @after-leave="handleAfterLeave">
        <div v-if="open && project" class="flex min-h-full items-center justify-center p-4 sm:p-6" @click.self="close">
          <div
            class="modal-panel relative flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-surface-card shadow-[0_32px_80px_-32px_rgba(0,0,0,0.9)] sm:max-w-2xl"
            :style="`--accent: ${project.accent}`"
          >
            <!-- Terminal-style title bar -->
            <div class="flex shrink-0 items-center gap-3 border-b border-border bg-background/60 px-4 py-3">
              <div class="flex items-center gap-1.5" aria-hidden="true">
                <span class="h-2.5 w-2.5 rounded-full bg-foreground/15" />
                <span class="h-2.5 w-2.5 rounded-full bg-foreground/15" />
                <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: project.accent }" />
              </div>
              <p class="min-w-0 flex-1 truncate font-mono text-[10px] text-muted">
                ~/case-studies/{{ project.slug }}.md
              </p>
              <button
                type="button"
                autofocus
                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-transparent text-muted transition-colors hover:border-border hover:text-foreground"
                :aria-label="t('projects.closeQuickView')"
                @click="close"
              >
                <X :size="16" aria-hidden="true" />
              </button>
            </div>

            <div class="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">
              <div class="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[9px] uppercase tracking-[0.18em]">
                <span class="inline-flex items-center gap-1.5 text-(--accent)">
                  <span class="h-1.5 w-1.5 rounded-full" :style="{ backgroundColor: project.accent }" />
                  {{ project.sector }}
                </span>
                <span class="text-border" aria-hidden="true">//</span>
                <span class="text-muted">{{ project.year }}</span>
                <span class="text-border" aria-hidden="true">//</span>
                <span class="inline-flex items-center gap-1.5 text-cyan-accent">
                  <span class="h-1 w-1 animate-pulse-dot rounded-full bg-cyan-accent" />
                  {{ project.status }}
                </span>
              </div>

              <h2
                id="quick-view-title"
                class="mt-3 font-sans text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
              >
                {{ project.title }}
                <span class="text-(--accent)">{{ project.titleHighlight }}</span>
              </h2>

              <p id="quick-view-summary" class="mt-3 text-sm leading-relaxed text-muted">
                {{ project.summary }}
              </p>

              <div class="mt-5 flex flex-wrap gap-1.5">
                <span
                  v-for="tag in project.techTags"
                  :key="tag"
                  class="rounded border border-border/70 bg-background/50 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-cyan-accent"
                >
                  {{ tag }}
                </span>
              </div>

              <!-- Audit metrics -->
              <div class="mt-6 rounded-xl border border-border bg-background/50 p-4">
                <div class="flex items-center justify-between gap-3">
                  <p class="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                    {{ t('projects.auditLatency') }}
                  </p>
                  <span
                    class="rounded border border-border px-2 py-0.5 font-mono text-[9px] text-cyan-accent"
                  >
                    {{ project.audit.badge }}
                  </span>
                </div>

                <p
                  class="mt-4 line-clamp-2 border-t border-border/60 pt-3 font-mono text-[10px] leading-relaxed text-muted"
                >
                  {{ project.audit.diagnosis }}
                </p>
              </div>

              <div class="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted transition-colors hover:border-border-hover hover:text-foreground"
                  @click="close"
                >
                  {{ t('projects.close') }}
                </button>
                <a
                  v-if="project.links.repo"
                  :href="project.links.repo"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface-card/70 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/80 transition-colors hover:border-border-hover hover:text-accent-hover"
                >
                  {{ t('detail.viewCode') }}
                  <ExternalLink :size="13" aria-hidden="true" />
                </a>
                <RouterLink
                  :to="projectPath(project.slug)"
                  class="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-accent px-4 py-2.5 font-sans text-xs font-semibold text-accent-contrast interactive-transition hover:bg-accent-hover hover:shadow-[0_0_24px_rgba(var(--ech-accent-rgb),0.45)]"
                  @click="close"
                >
                  {{ t('projects.viewFull') }}
                  <ArrowRight :size="15" aria-hidden="true" />
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </dialog>
  </Teleport>
</template>

<style>
.quick-view-dialog {
  position: fixed;
  inset: 0;
  width: 100vw;
  max-width: 100vw;
  height: 100vh;
  height: 100dvh;
  max-height: 100dvh;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  overflow: hidden;
  overscroll-behavior: contain;
}

.quick-view-dialog::backdrop {
  overflow: hidden;
  overscroll-behavior: contain;
  background: var(--ech-glass);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
</style>

<style scoped>
.modal-panel {
  max-height: calc(100vh - 2rem);
  max-height: calc(100dvh - 2rem);
}

@media (min-width: 640px) {
  .modal-panel {
    max-height: calc(100vh - 3rem);
    max-height: calc(100dvh - 3rem);
  }
}

.modal-enter-active,
.modal-leave-active {
  transition:
    opacity 200ms ease,
    transform 240ms cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.985);
}
</style>
