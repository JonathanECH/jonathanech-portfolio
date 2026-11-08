<script setup lang="ts">
import { computed } from 'vue'
import { CircleCheck } from '@lucide/vue'
import { useI18n } from '@/i18n'
import type { GallerySlide, MockupVariant } from '@/types/portfolio'

const props = defineProps<{
  slide: GallerySlide
  accent: string
  projectSlug: string
}>()

const { t } = useI18n()

const isErp = computed(() => props.projectSlug === 'erp-contable')

const variantLabels: Record<MockupVariant, string> = {
  inventory: 'INVENTORY OPS',
  ledger: 'LEDGER AUDIT',
  batches: 'WAREHOUSE TELEMETRY',
  medical: 'CLINIC AGENDA',
  erp: 'FINANCIAL CLOSE',
  analytics: 'OCCUPANCY ANALYTICS',
}

const variantLabel = computed(() => {
  if (props.slide.variant === 'ledger') {
    return isErp.value ? 'GENERAL LEDGER' : 'LEDGER AUDIT'
  }

  if (props.slide.variant === 'analytics') {
    return isErp.value ? 'CLOSE TELEMETRY' : 'OCCUPANCY ANALYTICS'
  }

  return variantLabels[props.slide.variant]
})

const glowStyle = computed(() => ({
  background: `radial-gradient(circle at 82% 8%, ${props.accent}22, transparent 62%)`,
}))

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

interface InventoryStat {
  readonly label: string
  readonly value: string
  readonly fill: string
  readonly highlight?: boolean
}

const inventoryStats = computed<readonly InventoryStat[]>(() => [
  { label: t('mockup.stock'), value: '18,420', fill: '82%', highlight: true },
  { label: t('mockup.activeBatches'), value: '312', fill: '64%' },
  { label: t('mockup.alerts'), value: '07', fill: '28%' },
])

interface InventoryRow {
  readonly sku: string
  readonly size: string
  readonly stock: string
  readonly status: string
  readonly warn?: boolean
}

const inventoryRows = computed<readonly InventoryRow[]>(() => [
  { sku: 'TX-4410 / L-08', size: 'M', stock: '184', status: 'OK' },
  { sku: 'TX-4412 / L-09', size: 'L', stock: '092', status: 'OK' },
  { sku: 'TX-4420 / L-12', size: 'S', stock: '014', status: t('mockup.restock'), warn: true },
  { sku: 'TX-4431 / L-14', size: 'XL', stock: '240', status: 'OK' },
])

interface LedgerEntry {
  readonly id: string
  readonly account: string
  readonly debit: string
  readonly credit: string
}

const inventoryLedgerEntries = computed<readonly LedgerEntry[]>(() => [
  { id: 'a1', account: t('mockup.accountCash'), debit: '24,800.00', credit: '' },
  { id: 'a2', account: t('mockup.accountB2bSales'), debit: '', credit: '24,800.00' },
  { id: 'a3', account: t('mockup.accountCogs'), debit: '9,120.00', credit: '' },
  { id: 'a4', account: t('mockup.accountInventory'), debit: '', credit: '9,120.00' },
  { id: 'a5', account: t('mockup.accountBatchAdjustment'), debit: '312.40', credit: '' },
  { id: 'a6', account: t('mockup.accountShrinkage'), debit: '', credit: '312.40' },
])

const erpLedgerEntries = computed<readonly LedgerEntry[]>(() => [
  { id: 'a1', account: t('mockup.accountCash'), debit: '24,800.00', credit: '' },
  { id: 'a2', account: t('mockup.accountServiceRevenue'), debit: '', credit: '24,800.00' },
  { id: 'a3', account: t('mockup.accountOperatingExpense'), debit: '9,120.00', credit: '' },
  { id: 'a4', account: t('mockup.accountPayables'), debit: '', credit: '9,120.00' },
  { id: 'a5', account: t('mockup.accountVatCredit'), debit: '312.40', credit: '' },
  { id: 'a6', account: t('mockup.accountVatPayable'), debit: '', credit: '312.40' },
])

const ledgerEntries = computed(() =>
  isErp.value ? erpLedgerEntries.value : inventoryLedgerEntries.value,
)

const ledgerTotal = '34,232.40'

const ledgerBars: readonly number[] = [30, 48, 42, 62, 54, 70, 64, 82, 76, 90, 84, 96]

interface BatchRow {
  readonly code: string
  readonly progress: string
  readonly latency: string
}

const batchRows: readonly BatchRow[] = [
  { code: 'LT-0921', progress: '84%', latency: '38ms' },
  { code: 'LT-0922', progress: '62%', latency: '44ms' },
  { code: 'LT-0923', progress: '91%', latency: '36ms' },
  { code: 'LT-0924', progress: '47%', latency: '51ms' },
]

interface MedicalSlot {
  readonly time: string
  readonly patient: string
  readonly active?: boolean
}

interface MedicalColumn {
  readonly room: string
  readonly slots: readonly MedicalSlot[]
}

const medicalColumns = computed<readonly MedicalColumn[]>(() => [
  {
    room: t('mockup.room', { number: '01' }),
    slots: [
      { time: '08:00', patient: 'A. Rivas', active: true },
      { time: '08:30', patient: 'M. León' },
      { time: '09:00', patient: 'J. Pérez', active: true },
    ],
  },
  {
    room: t('mockup.room', { number: '02' }),
    slots: [
      { time: '08:00', patient: 'C. Díaz' },
      { time: '08:30', patient: 'L. Mora', active: true },
      { time: '09:00', patient: '—' },
    ],
  },
  {
    room: t('mockup.room', { number: '03' }),
    slots: [
      { time: '08:00', patient: 'R. Silva', active: true },
      { time: '08:30', patient: 'P. Ruiz' },
      { time: '09:00', patient: 'T. Gil', active: true },
    ],
  },
])

interface ErpLine {
  readonly label: string
  readonly value: string
  readonly total?: boolean
}

const erpLines = computed<readonly ErpLine[]>(() => [
  { label: t('mockup.erpOperatingRevenue'), value: '148,320' },
  { label: t('mockup.erpCostOfSales'), value: '(62,140)' },
  { label: t('mockup.erpGrossMargin'), value: '86,180', total: true },
  { label: t('mockup.erpOperatingExpenses'), value: '(24,860)' },
  { label: t('mockup.erpNetResult'), value: '61,320', total: true },
])

const erpBars: readonly number[] = [38, 52, 44, 66, 58, 78, 62, 84, 72, 92]

interface AnalyticsMetric {
  readonly label: string
  readonly value: string
  readonly fill: string
}

const clinicAnalyticsMetrics = computed<readonly AnalyticsMetric[]>(() => [
  { label: t('mockup.occupancy'), value: '87%', fill: '87%' },
  { label: t('mockup.avgWait'), value: '12m', fill: '42%' },
  { label: t('mockup.slaMet'), value: '96%', fill: '96%' },
])

const erpAnalyticsMetrics = computed<readonly AnalyticsMetric[]>(() => [
  { label: t('mockup.avgLatency'), value: '64ms', fill: '64%' },
  { label: t('mockup.integrity'), value: '100%', fill: '100%' },
  { label: t('mockup.transactions'), value: '8,412', fill: '84%' },
])

const analyticsMetrics = computed(() =>
  isErp.value ? erpAnalyticsMetrics.value : clinicAnalyticsMetrics.value,
)

const analyticsOverlay = computed(() =>
  isErp.value
    ? { label: t('mockup.latency'), value: '64ms' }
    : { label: t('mockup.occupancy'), value: '87%' },
)

const analyticsAxis = computed(() =>
  isErp.value ? ['S1', 'S2', 'S3', 'S4'] : ['08:00', '12:00', '16:00', '20:00'],
)
</script>

<template>
  <div class="relative h-full w-full overflow-hidden bg-background">
    <img
      v-if="slide.image"
      :src="slide.image"
      :alt="slide.alt ?? slide.title"
      class="h-full w-full object-cover"
      loading="lazy"
    />
    <div
      v-else
      class="relative h-full w-full bg-grid-fine"
      role="img"
      :aria-label="t('mockup.visualAria', { title: slide.title })"
    >
      <div class="pointer-events-none absolute inset-0" :style="glowStyle" aria-hidden="true" />

      <div class="relative flex h-full flex-col">
        <header
          class="flex shrink-0 items-center justify-between border-b border-border/80 px-3 py-2 sm:px-4"
        >
          <div class="flex min-w-0 items-center gap-2">
            <span
              class="h-1.5 w-1.5 shrink-0 rounded-full"
              :style="{ backgroundColor: accent }"
              aria-hidden="true"
            />
            <span
              class="truncate font-mono text-[7px] uppercase tracking-[0.22em] text-muted sm:text-[9px]"
            >
              {{ variantLabel }}
            </span>
          </div>
          <div
            class="flex shrink-0 items-center gap-1.5 font-mono text-[6px] uppercase tracking-wider text-muted sm:text-[8px]"
          >
            <span class="rounded-sm border border-border px-1.5 py-0.5">v2.4</span>
            <span class="hidden rounded-sm border border-border px-1.5 py-0.5 sm:inline">LIVE</span>
          </div>
        </header>

        <div class="min-h-0 flex-1 overflow-hidden">
          <!-- INVENTORY -->
          <div
            v-if="slide.variant === 'inventory'"
            class="grid h-full grid-cols-[auto_1fr] gap-2 p-2 sm:gap-3 sm:p-3"
          >
            <aside
              class="hidden w-9 flex-col gap-1.5 border-r border-border/60 pr-2 sm:flex"
              aria-hidden="true"
            >
              <div
                v-for="item in 5"
                :key="item"
                class="h-4 rounded-sm"
                :style="
                  item === 1
                    ? { backgroundColor: `${accent}2e` }
                    : { backgroundColor: 'rgba(var(--ech-ink-rgb),0.04)' }
                "
              />
            </aside>

            <div class="flex min-w-0 flex-col gap-2">
              <div class="grid grid-cols-3 gap-1.5 sm:gap-2">
                <div
                  v-for="stat in inventoryStats"
                  :key="stat.label"
                  class="rounded-sm border border-border bg-surface/70 p-1.5 sm:p-2"
                >
                  <p
                    class="truncate font-mono text-[6px] uppercase tracking-wider text-muted sm:text-[8px]"
                  >
                    {{ stat.label }}
                  </p>
                  <p
                    class="mt-0.5 font-sans text-[11px] font-bold leading-none text-foreground sm:text-base"
                    :style="stat.highlight ? { color: accent } : undefined"
                  >
                    {{ stat.value }}
                  </p>
                  <div class="mt-1.5 h-0.5 w-full overflow-hidden rounded-full bg-foreground/5">
                    <div
                      class="h-full rounded-full"
                      :style="{ width: stat.fill, backgroundColor: accent }"
                    />
                  </div>
                </div>
              </div>

              <div class="min-h-0 flex-1 overflow-hidden rounded-sm border border-border bg-surface/50">
                <div
                  class="grid grid-cols-[1.4fr_0.5fr_0.5fr_0.9fr] gap-1.5 border-b border-border px-2 py-1 font-mono text-[6px] uppercase tracking-wider text-muted sm:text-[8px]"
                >
                  <span>{{ t('mockup.skuBatch') }}</span>
                  <span>{{ t('mockup.size') }}</span>
                  <span>{{ t('mockup.stockColumn') }}</span>
                  <span>{{ t('mockup.status') }}</span>
                </div>
                <div
                  v-for="row in inventoryRows"
                  :key="row.sku"
                  class="grid grid-cols-[1.4fr_0.5fr_0.5fr_0.9fr] items-center gap-1.5 border-b border-border/40 px-2 py-[5px] font-mono text-[6px] last:border-0 sm:text-[8px]"
                >
                  <span class="truncate text-foreground/80">{{ row.sku }}</span>
                  <span class="text-muted">{{ row.size }}</span>
                  <span class="text-foreground/70">{{ row.stock }}</span>
                  <span class="flex min-w-0 items-center gap-1">
                    <span
                      class="h-1 w-1 shrink-0 rounded-full"
                      :style="{ backgroundColor: row.warn ? 'var(--color-warning)' : accent }"
                    />
                    <span
                      class="truncate"
                      :style="
                        row.warn
                          ? { color: 'var(--color-warning)' }
                          : { color: 'rgba(var(--ech-ink-rgb),0.55)' }
                      "
                    >
                      {{ row.status }}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- LEDGER -->
          <div
            v-else-if="slide.variant === 'ledger'"
            class="flex h-full flex-col gap-2 p-2 sm:gap-3 sm:p-3"
          >
            <div class="flex items-start justify-between gap-2">
              <div>
                <p
                  class="font-mono text-[6px] uppercase tracking-wider text-muted sm:text-[8px]"
                >
                  {{ t('mockup.periodBalance') }}
                </p>
                <p class="font-sans text-base font-bold leading-none text-foreground sm:text-2xl">
                  $ {{ ledgerTotal }}
                </p>
              </div>
              <div class="rounded-sm border border-border bg-surface/70 px-2 py-1 text-right">
                <p
                  class="font-mono text-[6px] uppercase tracking-wider text-muted sm:text-[7px]"
                >
                  {{ t('mockup.debitEqualsCredit') }}
                </p>
                <p
                  class="font-mono text-[8px] font-semibold sm:text-[10px]"
                  :style="{ color: accent }"
                >
                  {{ t('mockup.balanced') }}
                </p>
              </div>
            </div>

            <div class="grid min-h-0 flex-1 grid-cols-[1fr_auto] gap-2">
              <div class="min-h-0 overflow-hidden rounded-sm border border-border bg-surface/50">
                <div
                  class="grid grid-cols-[0.4fr_1.5fr_0.8fr_0.8fr] gap-1 border-b border-border px-2 py-1 font-mono text-[6px] uppercase tracking-wider text-muted sm:text-[8px]"
                >
                  <span>#</span>
                  <span>{{ t('mockup.account') }}</span>
                  <span>{{ t('mockup.debit') }}</span>
                  <span>{{ t('mockup.credit') }}</span>
                </div>
                <div
                  v-for="(entry, index) in ledgerEntries"
                  :key="entry.id"
                  class="grid grid-cols-[0.4fr_1.5fr_0.8fr_0.8fr] items-center gap-1 border-b border-border/40 px-2 py-[5px] font-mono text-[6px] last:border-0 sm:text-[8px]"
                >
                  <span class="text-muted">{{ pad(index + 1) }}</span>
                  <span class="truncate text-foreground/80">{{ entry.account }}</span>
                  <span class="truncate text-foreground/70">{{ entry.debit || '—' }}</span>
                  <span
                    class="truncate"
                    :style="
                      entry.credit
                        ? { color: accent }
                        : { color: 'rgba(var(--ech-ink-rgb),0.35)' }
                    "
                  >
                    {{ entry.credit || '—' }}
                  </span>
                </div>
              </div>

              <div class="flex w-14 flex-col gap-1.5 sm:w-24">
                <div class="rounded-sm border border-border bg-surface/70 p-1.5">
                  <p
                    class="font-mono text-[5px] uppercase tracking-wider text-muted sm:text-[7px]"
                  >
                    {{ t('mockup.blockHash') }}
                  </p>
                  <p class="mt-0.5 font-mono text-[5px] leading-tight text-foreground/60 sm:text-[7px]">
                    a3f9…e21c
                  </p>
                </div>
                <div
                  class="flex min-h-0 flex-1 items-end gap-0.5 rounded-sm border border-border bg-surface/50 p-1"
                >
                  <div
                    v-for="(height, index) in ledgerBars"
                    :key="index"
                    class="flex-1 rounded-t-[1px]"
                    :style="{
                      height: `${height}%`,
                      backgroundColor: index % 3 === 0 ? accent : 'rgba(var(--ech-ink-rgb),0.12)',
                    }"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- BATCHES -->
          <div
            v-else-if="slide.variant === 'batches'"
            class="flex h-full flex-col gap-2 p-2 sm:gap-3 sm:p-3"
          >
            <div class="grid grid-cols-3 gap-1.5 sm:gap-2">
              <div class="rounded-sm border border-border bg-surface/70 px-1.5 py-1 sm:px-2">
                <p
                  class="truncate font-mono text-[5px] uppercase tracking-wider text-muted sm:text-[7px]"
                >
                  {{ t('mockup.rfTerminals') }}
                </p>
                <p class="font-sans text-[10px] font-bold leading-none text-foreground sm:text-sm">24</p>
              </div>
              <div class="rounded-sm border border-border bg-surface/70 px-1.5 py-1 sm:px-2">
                <p
                  class="truncate font-mono text-[5px] uppercase tracking-wider text-muted sm:text-[7px]"
                >
                  {{ t('mockup.avgLatency') }}
                </p>
                <p
                  class="font-sans text-[10px] font-bold leading-none sm:text-sm"
                  :style="{ color: accent }"
                >
                  42ms
                </p>
              </div>
              <div class="rounded-sm border border-border bg-surface/70 px-1.5 py-1 sm:px-2">
                <p
                  class="truncate font-mono text-[5px] uppercase tracking-wider text-muted sm:text-[7px]"
                >
                  {{ t('mockup.syncQueue') }}
                </p>
                <p class="font-sans text-[10px] font-bold leading-none text-foreground sm:text-sm">00</p>
              </div>
            </div>

            <div class="grid min-h-0 flex-1 grid-cols-[1.1fr_1fr] gap-2">
              <div
                class="flex min-h-0 flex-col gap-1.5 overflow-hidden rounded-sm border border-border bg-surface/50 p-1.5"
              >
                <p
                  class="font-mono text-[6px] uppercase tracking-wider text-muted sm:text-[8px]"
                >
                  {{ t('mockup.batchesInTransit') }}
                </p>
                <div
                  v-for="batch in batchRows"
                  :key="batch.code"
                  class="flex items-center gap-1.5"
                >
                  <span
                    class="w-9 shrink-0 truncate font-mono text-[6px] text-foreground/70 sm:w-12 sm:text-[8px]"
                  >
                    {{ batch.code }}
                  </span>
                  <div class="h-1 flex-1 overflow-hidden rounded-full bg-foreground/5">
                    <div
                      class="h-full rounded-full"
                      :style="{ width: batch.progress, backgroundColor: accent }"
                    />
                  </div>
                  <span
                    class="w-7 shrink-0 text-right font-mono text-[6px] text-muted sm:text-[8px]"
                  >
                    {{ batch.latency }}
                  </span>
                </div>
              </div>

              <div
                class="relative min-h-0 overflow-hidden rounded-sm border border-border bg-surface/50"
              >
                <svg
                  viewBox="0 0 120 48"
                  preserveAspectRatio="none"
                  class="h-full w-full text-foreground/10"
                  aria-hidden="true"
                >
                  <line
                    v-for="y in [12, 24, 36]"
                    :key="y"
                    x1="0"
                    :y1="y"
                    x2="120"
                    :y2="y"
                    stroke="currentColor"
                    stroke-width="0.5"
                  />
                  <path
                    d="M0,38 L12,30 L24,33 L36,22 L48,26 L60,14 L72,18 L84,10 L96,16 L108,8 L120,12 L120,48 L0,48 Z"
                    :fill="accent"
                    opacity="0.14"
                  />
                  <path
                    d="M0,38 L12,30 L24,33 L36,22 L48,26 L60,14 L72,18 L84,10 L96,16 L108,8 L120,12"
                    fill="none"
                    :stroke="accent"
                    stroke-width="1.2"
                    stroke-linejoin="round"
                  />
                </svg>
                <span
                  class="absolute bottom-1 left-1.5 font-mono text-[5px] uppercase tracking-wider text-muted sm:text-[7px]"
                >
                  {{ t('mockup.throughput') }}
                </span>
              </div>
            </div>
          </div>

          <!-- MEDICAL -->
          <div
            v-else-if="slide.variant === 'medical'"
            class="flex h-full flex-col gap-1.5 p-2 sm:gap-2 sm:p-3"
          >
            <div
              class="flex items-center justify-between font-mono text-[6px] uppercase tracking-wider text-muted sm:text-[8px]"
            >
              <span>{{ t('mockup.dailyAgenda') }}</span>
              <span :style="{ color: accent }">14 NOV</span>
            </div>

            <div class="grid min-h-0 flex-1 grid-cols-3 gap-1 sm:gap-1.5">
              <div
                v-for="column in medicalColumns"
                :key="column.room"
                class="flex min-h-0 flex-col gap-1 overflow-hidden rounded-sm border border-border bg-surface/40 p-1"
              >
                <p
                  class="truncate font-mono text-[5px] uppercase tracking-wider text-muted sm:text-[7px]"
                >
                  {{ column.room }}
                </p>
                <div
                  v-for="slot in column.slots"
                  :key="slot.time"
                  class="rounded-[2px] border px-1 py-0.5"
                  :style="{
                    borderColor: slot.active ? `${accent}66` : 'rgba(var(--ech-ink-rgb),0.06)',
                    backgroundColor: slot.active ? `${accent}1f` : 'rgba(var(--ech-ink-rgb),0.02)',
                  }"
                >
                  <p class="font-mono text-[5px] text-muted sm:text-[6px]">{{ slot.time }}</p>
                  <p
                    class="truncate font-sans text-[6px] leading-tight text-foreground/80 sm:text-[8px]"
                  >
                    {{ slot.patient }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- ERP -->
          <div
            v-else-if="slide.variant === 'erp'"
            class="grid h-full grid-cols-2 gap-2 p-2 sm:gap-3 sm:p-3"
          >
            <div class="flex min-h-0 flex-col gap-1.5">
              <p class="font-mono text-[6px] uppercase tracking-wider text-muted sm:text-[8px]">
                {{ t('mockup.incomeStatement') }}
              </p>
              <div
                v-for="line in erpLines"
                :key="line.label"
                class="flex items-center justify-between gap-2 border-b border-border/40 pb-1 font-mono text-[6px] sm:text-[8px]"
              >
                <span class="truncate text-muted">{{ line.label }}</span>
                <span
                  class="shrink-0"
                  :style="
                    line.total
                      ? { color: accent }
                      : { color: 'rgba(var(--ech-ink-rgb),0.72)' }
                  "
                >
                  {{ line.value }}
                </span>
              </div>
              <div
                class="mt-auto flex items-center gap-1.5 rounded-sm border border-border bg-surface/60 px-1.5 py-1"
              >
                <CircleCheck
                  class="h-3 w-3 shrink-0"
                  :style="{ color: accent }"
                  aria-hidden="true"
                />
                <span
                  class="truncate font-mono text-[5px] uppercase tracking-wider text-foreground/70 sm:text-[7px]"
                >
                  {{ t('mockup.bankReconciliation') }}
                </span>
              </div>
            </div>

            <div
              class="flex min-h-0 flex-col gap-1.5 rounded-sm border border-border bg-surface/40 p-1.5"
            >
              <p class="font-mono text-[6px] uppercase tracking-wider text-muted sm:text-[8px]">
                {{ t('mockup.cashFlow') }}
              </p>
              <div class="flex min-h-0 flex-1 items-end gap-1">
                <div
                  v-for="(height, index) in erpBars"
                  :key="index"
                  class="flex-1 rounded-t-[1px]"
                  :style="{
                    height: `${height}%`,
                    backgroundColor:
                      index === erpBars.length - 1 ? accent : 'rgba(var(--ech-ink-rgb),0.14)',
                  }"
                />
              </div>
              <div
                class="flex justify-between font-mono text-[5px] uppercase tracking-wider text-muted sm:text-[7px]"
              >
                <span>{{ t('mockup.jan') }}</span>
                <span>{{ t('mockup.jun') }}</span>
                <span>{{ t('mockup.dec') }}</span>
              </div>
            </div>
          </div>

          <!-- ANALYTICS -->
          <div
            v-else-if="slide.variant === 'analytics'"
            class="flex h-full flex-col gap-2 p-2 sm:gap-3 sm:p-3"
          >
            <div class="grid grid-cols-3 gap-1.5 sm:gap-2">
              <div
                v-for="metric in analyticsMetrics"
                :key="metric.label"
                class="rounded-sm border border-border bg-surface/70 px-1.5 py-1 sm:px-2"
              >
                <p
                  class="truncate font-mono text-[5px] uppercase tracking-wider text-muted sm:text-[7px]"
                >
                  {{ metric.label }}
                </p>
                <p
                  class="font-sans text-[10px] font-bold leading-none sm:text-sm"
                  :style="{ color: accent }"
                >
                  {{ metric.value }}
                </p>
                <div class="mt-1 h-0.5 w-full overflow-hidden rounded-full bg-foreground/5">
                  <div
                    class="h-full rounded-full"
                    :style="{ width: metric.fill, backgroundColor: accent }"
                  />
                </div>
              </div>
            </div>

            <div
              class="relative min-h-0 flex-1 overflow-hidden rounded-sm border border-border bg-surface/40"
            >
              <svg
                viewBox="0 0 240 80"
                preserveAspectRatio="none"
                class="h-full w-full text-foreground/10"
                aria-hidden="true"
              >
                <line
                  v-for="y in [16, 32, 48, 64]"
                  :key="y"
                  x1="0"
                  :y1="y"
                  x2="240"
                  :y2="y"
                  stroke="currentColor"
                  stroke-width="0.5"
                />
                <path
                  d="M0,64 L20,58 L40,60 L60,44 L80,48 L100,32 L120,38 L140,24 L160,30 L180,16 L200,22 L220,12 L240,18 L240,80 L0,80 Z"
                  :fill="accent"
                  opacity="0.16"
                />
                <path
                  d="M0,64 L20,58 L40,60 L60,44 L80,48 L100,32 L120,38 L140,24 L160,30 L180,16 L200,22 L220,12 L240,18"
                  fill="none"
                  :stroke="accent"
                  stroke-width="1.2"
                  stroke-linejoin="round"
                />
                <circle cx="180" cy="16" r="2.4" :fill="accent" />
                <circle cx="220" cy="12" r="2.4" :fill="accent" />
              </svg>
              <div
                class="absolute left-2 top-1.5 font-mono text-[5px] uppercase tracking-wider text-muted sm:text-[7px]"
              >
                {{ analyticsOverlay.label }}
                <span :style="{ color: accent }">{{ analyticsOverlay.value }}</span>
              </div>
              <div
                class="absolute bottom-1 left-2 flex gap-2 font-mono text-[5px] uppercase tracking-wider text-muted sm:text-[6px]"
              >
                <span v-for="label in analyticsAxis" :key="label">{{ label }}</span>
              </div>
            </div>
          </div>

          <!-- FALLBACK -->
          <div
            v-else
            class="flex h-full items-center justify-center p-4 text-center font-mono text-[9px] uppercase tracking-wider text-muted"
          >
            {{ slide.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
