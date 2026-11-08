<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowRight, X } from '@lucide/vue'
import { useFocusTrap } from '@/composables/useFocusTrap'
import { useScrollLock } from '@/composables/useScrollLock'
import { usePortfolioStore } from '@/stores/portfolio'

const store = usePortfolioStore()

const dialogRef = ref<HTMLElement | null>(null)
const open = computed(() => store.isQuickViewOpen)
const project = computed(() => store.quickViewProject)

const locked = ref(false)
watch(
  open,
  (isOpen) => {
    if (isOpen) locked.value = true
  },
  { immediate: true },
)

useScrollLock(locked)
useFocusTrap(dialogRef, open)

function handleAfterLeave(): void {
  if (!open.value) locked.value = false
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && store.isQuickViewOpen) {
    event.preventDefault()
    store.closeQuickView()
  }
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="modal" @after-leave="handleAfterLeave">
      <div
        v-if="open && project"
        class="fixed inset-0 z-[100] overflow-y-auto bg-background/80 backdrop-blur-md"
        @click.self="store.closeQuickView"
      >
        <div
          class="flex min-h-full items-center justify-center p-4 sm:p-6"
          @click.self="store.closeQuickView"
        >
          <div
            ref="dialogRef"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-view-title"
            tabindex="-1"
            class="modal-panel relative flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-surface-card shadow-[0_32px_80px_-32px_rgba(0,0,0,0.9)] sm:max-h-[calc(100dvh-3rem)]"
            :style="`--accent: ${project.accent}`"
          >
            <!-- Terminal-style title bar -->
            <div class="flex shrink-0 items-center gap-3 border-b border-border bg-background/60 px-4 py-3">
              <div class="flex items-center gap-1.5" aria-hidden="true">
                <span class="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span class="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: project.accent }" />
              </div>
              <p class="min-w-0 flex-1 truncate font-mono text-[10px] text-muted">
                ~/case-studies/{{ project.slug }}.md
              </p>
              <button
                type="button"
                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-transparent text-muted transition-colors hover:border-border hover:text-white"
                aria-label="Cerrar vista rápida"
                @click="store.closeQuickView"
              >
                <X :size="16" aria-hidden="true" />
              </button>
            </div>

            <div class="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">
              <div class="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[9px] uppercase tracking-[0.18em]">
                <span class="inline-flex items-center gap-1.5 text-[var(--accent)]">
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
                class="mt-3 font-sans text-2xl font-bold tracking-tight text-white sm:text-3xl"
              >
                {{ project.title }}
                <span class="text-[var(--accent)]">{{ project.titleHighlight }}</span>
              </h2>

              <p class="mt-3 text-sm leading-relaxed text-muted">{{ project.summary }}</p>

              <div class="mt-5 flex flex-wrap gap-1.5">
                <span
                  v-for="tag in project.techTags"
                  :key="tag"
                  class="rounded border border-border/70 bg-background/50 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-cyan-accent/90"
                >
                  {{ tag }}
                </span>
              </div>

              <!-- Audit metrics -->
              <div class="mt-6 rounded-xl border border-border bg-background/50 p-4">
                <div class="flex items-center justify-between gap-3">
                  <p class="font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                    AUDIT // LATENCY_REPORT
                  </p>
                  <span
                    class="rounded border border-border px-2 py-0.5 font-mono text-[9px] text-cyan-accent"
                  >
                    {{ project.audit.latencyDelta }}
                  </span>
                </div>

                <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <p class="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">ANTES</p>
                    <p class="mt-1 font-mono text-lg text-muted line-through">
                      {{ project.audit.latencyBefore }}
                    </p>
                  </div>

                  <div class="flex items-center gap-2">
                    <ArrowRight :size="16" class="shrink-0 text-cyan-accent" aria-hidden="true" />
                    <div>
                      <p class="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                        DESPUÉS
                      </p>
                      <p class="mt-1 font-mono text-lg text-[var(--accent)]">
                        {{ project.audit.latencyAfter }}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p class="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
                      DISCREPANCIA
                    </p>
                    <p class="mt-1 font-mono text-lg text-cyan-accent">
                      {{ project.audit.discrepancy }}
                    </p>
                  </div>
                </div>

                <p class="mt-4 border-t border-border/60 pt-3 font-mono text-[10px] leading-relaxed text-muted">
                  {{ project.audit.consistencyNote }}
                </p>
              </div>

              <div class="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted transition-colors hover:border-border-hover hover:text-white"
                  @click="store.closeQuickView"
                >
                  Cerrar
                </button>
                <RouterLink
                  :to="`/proyectos/${project.slug}`"
                  class="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-accent px-4 py-2.5 font-sans text-xs font-semibold text-black transition-all duration-300 hover:shadow-[0_0_24px_rgba(0,229,255,0.45)]"
                  @click="store.closeQuickView"
                >
                  Ver caso de estudio completo
                  <ArrowRight :size="15" aria-hidden="true" />
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 200ms ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-panel,
.modal-leave-active .modal-panel {
  transition:
    transform 240ms cubic-bezier(0.16, 1, 0.3, 1),
    opacity 200ms ease;
}

.modal-enter-from .modal-panel,
.modal-leave-to .modal-panel {
  opacity: 0;
  transform: translateY(16px) scale(0.985);
}
</style>
