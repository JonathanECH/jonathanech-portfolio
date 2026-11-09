import { technologies } from '@/data/portfolio'
import type {
  ContactChannel,
  PortfolioContent,
  Profile,
  Project,
  TechFilterOption,
} from '@/types/portfolio'

const techFilterOptions: readonly TechFilterOption[] = [
  { value: 'all', label: 'ALL' },
  { value: 'frontend', label: 'FRONTEND' },
  { value: 'backend', label: 'BACKEND & RUNTIMES' },
  { value: 'database', label: 'DATABASES & ORM' },
  { value: 'devops', label: 'DEVOPS & TOOLS' },
]

const projects: readonly Project[] = [
  {
    slug: 'tilyshop-inventory',
    name: 'TilyShop Inventory',
    sector: 'STOCK AUDIT',
    title: 'TILYSHOP',
    titleHighlight: 'INVENTORY',
    year: '2026',
    status: 'CASE STUDY',
    summary:
      'Offline-first inventory system for retail POS: client-side effective stock calculation, atomic batch traceability and transactional synchronization.',
    problem:
      'Retail POS points with unstable connectivity and overselling risks across concurrent terminals. The previous setup lacked atomicity and audit trails for stock adjustments.',
    techTags: ['Vue 3', 'TypeScript', 'Pinia', 'PostgreSQL', 'Tailwind CSS'],
    role: 'Frontend Developer & Offline-First Architecture',
    client: 'Retail POS / Textile Distribution',
    duration: '6 Weeks // October 2026 – November 2026',
    stackKey: 'Vue 3 • TypeScript • PostgreSQL',
    links: {
      whitepaper: '/docs/tilyshop-whitepaper.pdf',
    },
    liveHost: 'app.tilyshop.internal',
    accent: '#00E5FF',
    galleryDescription:
      'Real interfaces from the operational flow: overview panel, inventory administration, sales history and profile security.',
    gallery: [
      {
        id: 'dashboard',
        title: 'Overview Panel & Sales',
        caption:
          'Unit summary, pending orders and quick sale registration from a single view.',
        path: 'dashboard',
        variant: 'inventory',
        badges: ['Operations Summary', 'Sale Entry', 'Stock'],
        image: '/projects/tilyshop-inventory/dashboard-tilyshop-inventory.webp',
        alt: 'TilyShop overview panel with unit metrics, pending orders and sale registration',
      },
      {
        id: 'admin',
        title: 'Inventory Administration',
        caption:
          'Catalogue with filters by institution, name, color and size; per-product editing and deletion.',
        path: 'admin/inventory',
        variant: 'inventory',
        badges: ['Catalogue', 'Filters', 'Sizes'],
        image: '/projects/tilyshop-inventory/admin-tilyshop-inventory.webp',
        alt: 'Inventory administration table with filters by institution, color and size',
      },
      {
        id: 'sales',
        title: 'Sales Log & History',
        caption:
          'Filters by date range, garment and seller, with unit and revenue totals.',
        path: 'sales',
        variant: 'analytics',
        badges: ['Sales', 'Filters', 'Totals'],
        image: '/projects/tilyshop-inventory/ventas-tilyshop-inventory.webp',
        alt: 'Sales history with filters by date, garment and seller',
      },
      {
        id: 'profile',
        title: 'Profile & Security',
        caption: 'Credential management and password change with client-side validation.',
        path: 'profile',
        variant: 'inventory',
        badges: ['Profile', 'Security', 'Credentials'],
        image: '/projects/tilyshop-inventory/perfil-tilyshop-inventory.webp',
        alt: 'Profile screen with a password change form',
      },
    ],
    challenge: {
      intro:
        'Before the redesign, inventory aggregated stock by reference and ignored granularity by size, color and batch. Each terminal wrote independently to the same row, with no optimistic locking and no single source of truth.',
      findings: [
        'Stock aggregated by reference: without granularity by size, color or batch, physical and digital inventory diverged silently.',
        'Non-atomic writes: two terminals could sell the same unit and overwrite stock without locking or reconciliation.',
        'N+1 reads and missing composite indexes: the telemetry panel took up to 4,820 ms to respond.',
      ],
    },
    audit: {
      diagnosis:
        'The previous inventory reconciled stock through manual processes and non-atomic writes. Batches were grouped by reference, without size granularity, and concurrent operations overwrote stock without optimistic locking.',
      resolution:
        'The data model was redesigned with atomic batches per SKU and size, an immutable transactional ledger and an offline-first reactive layer with optimistic locks. Critical queries were indexed and N+1 reads were eliminated.',
      latencyBefore: '4,820 ms',
      latencyAfter: '42 ms',
      latencyDelta: '−99.1%',
      discrepancy: '0.00%',
      consistencyNote: 'Idempotent synchronization with client_txn_id and atomic transactions documented in whitepaper.',
    },
    modules: [
      {
        code: 'MOD-A',
        title: 'Reactivity',
        subtitle: 'Reactive Layer with Vue 3 & Composition API',
        description:
          'Decoupled components, derived state and surgical watchers for live telemetry without unnecessary re-renders.',
        points: [
          'Domain-typed composables',
          'Derived state without duplication',
          'Lazy views with Suspense',
        ],
        icon: 'reactivity',
      },
      {
        code: 'MOD-B',
        title: 'Global State',
        subtitle: 'Predictable State Management with Pinia',
        description:
          'Domain stores with offline-first persistence and optimistic locks for concurrent warehouse operations.',
        points: [
          'Offline-first with sync queue',
          'Optimistic locks per SKU and batch',
          'Devtools and action traceability',
        ],
        icon: 'state',
      },
      {
        code: 'MOD-C',
        title: 'Persistence',
        subtitle: 'Transactional Integrity & Database',
        description:
          'PostgreSQL in strict ACID mode, versioned migrations and constraints that make silent mismatches impossible.',
        points: [
          'ACID transactions per movement',
          'Composite indexes and query tuning',
          'Reproducible migrations and seeds',
        ],
        icon: 'database',
      },
    ],
  },
  {
    slug: 'gestion-medica',
    name: 'Medical Management System',
    sector: 'HEALTHCARE SPA',
    title: 'MEDICAL',
    titleHighlight: 'MANAGEMENT SYSTEM',
    year: '2025',
    status: 'CASE STUDY',
    summary:
      'Clinical SPA for scheduling, records and triage: frictionless care flows, reactive state and an accessible interface for medical staff.',
    problem:
      'Fragmented workflow across paper records and isolated schedules; duplicate bookings and need for strict role-based access control.',
    techTags: ['Vue 3', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    role: 'Frontend Developer & SPA Integration',
    client: 'Healthcare / Clinic Administration',
    duration: '16 Weeks // Q3-Q4 2025',
    stackKey: 'Vue 3 • TypeScript • Supabase',
    links: {},
    liveHost: 'clinica.local',
    accent: '#5EEAD4',
    galleryDescription:
      'Real interfaces from the clinical flow: consultation scheduling, unified records and occupancy telemetry.',
    gallery: [
      {
        id: 'agenda',
        title: 'Clinical Schedule',
        caption:
          'Daily view of appointments, triage and occupancy per consultation room with live updates.',
        path: 'agenda-view',
        variant: 'medical',
        badges: ['Schedule', 'Triage', 'Real Time'],
      },
      {
        id: 'record',
        title: 'Patient Record',
        caption:
          'Unified history, vital signs and medical notes with role-based access control.',
        path: 'patient-record',
        variant: 'medical',
        badges: ['Record', 'Role Access', 'Audit'],
      },
      {
        id: 'analytics',
        title: 'Occupancy Telemetry',
        caption: 'Demand metrics, wait times and installed capacity by specialty.',
        path: 'analytics-view',
        variant: 'analytics',
        badges: ['Occupancy', 'SLA', 'Analytics'],
      },
    ],
    challenge: {
      intro:
        "Scheduling, triage and records lived in separate systems. Staff duplicated data between spreadsheets and paper, and there was no reliable view of the clinic's real occupancy.",
      findings: [
        'Duplicate appointments from parallel schedules without a single source of truth.',
        'Paper records without traceability or role-based access control.',
        'Invisible wait times: the clinic could not measure or prioritize demand.',
      ],
    },
    audit: {
      diagnosis:
        'The clinical flow depended on isolated schedules and manual records. Patient information was copied several times and triage decisions were made without occupancy telemetry.',
      resolution:
        'The clinical domain was unified into an SPA with reactive scheduling, a single patient record and role-based access policies. Supabase provided Row Level Security and realtime to sync consultation rooms without polling.',
      latencyBefore: '3,240 ms',
      latencyAfter: '58 ms',
      latencyDelta: '−98.2%',
      discrepancy: '0.02%',
      consistencyNote: 'Clinical workflows and role-based access control validated in testing environment.',
    },
    modules: [
      {
        code: 'MOD-A',
        title: 'Reactivity',
        subtitle: 'Reactive Clinical Flows',
        description:
          'Schedule and triage views that react to state changes without reloading the consultation session.',
        points: [
          'Schedule and triage composables',
          'Derived state per consultation room',
          'Optimistic appointment updates',
        ],
        icon: 'reactivity',
      },
      {
        code: 'MOD-B',
        title: 'Global State',
        subtitle: 'Real-Time Schedule Synchronization',
        description:
          'Session, patient and occupancy stores with realtime channels and version-based conflict resolution.',
        points: [
          'Persistent clinical session',
          'Realtime per consultation room',
          'Version-based conflict resolution',
        ],
        icon: 'state',
      },
      {
        code: 'MOD-C',
        title: 'Persistence',
        subtitle: 'Records with Row Level Security',
        description:
          'Row-level access policies and immutable auditing of every clinical read or write.',
        points: ['RLS by role and specialty', 'Access auditing', 'Backups and versioned migrations'],
        icon: 'database',
      },
    ],
  },
  {
    slug: 'erp-contable',
    name: 'ERP Lubriken',
    sector: 'TRANSACTIONAL ERP',
    title: 'ERP',
    titleHighlight: 'LUBRIKEN',
    year: '2026',
    status: 'CASE STUDY',
    summary:
      'Full-stack accounting platform with double-entry bookkeeping, bank reconciliation and reproducible financial reports on a transactional database.',
    problem:
      'Accounting close depended on disconnected spreadsheets; entries were duplicated and monthly reconciliation consumed days of manual work.',
    techTags: ['Vue 3', 'Node.js', 'PostgreSQL', 'Docker'],
    role: 'Frontend Developer & Business Logic',
    client: 'Commercial Distribution / ERP Case Study',
    duration: '16 Weeks // July 2026 – November 2026',
    stackKey: 'Vue 3 • Node.js • PostgreSQL',
    links: {},
    liveHost: 'erp.local',
    accent: '#A78BFA',
    galleryDescription:
      'Real interfaces from the accounting ERP: financial dashboard, general ledger, inventory, suppliers, audit and login.',
    gallery: [
      {
        id: 'dashboard',
        title: 'Financial Dashboard',
        caption:
          'Revenue, expenses, profitability and main accounts for the fiscal year in real time.',
        path: 'dashboard',
        variant: 'erp',
        badges: ['Revenue', 'Expenses', 'Profitability'],
        image: '/projects/erp-lubriken/dashboard-ERP-lubriken.webp',
        alt: 'Financial dashboard with revenue, expenses and main accounts',
      },
      {
        id: 'accounting',
        title: 'Accounting & General Ledger',
        caption:
          'Chart of accounts, double-entry journal entries and fiscal periods in a single console.',
        path: 'accounting',
        variant: 'ledger',
        badges: ['Double Entry', 'General Ledger', 'Periods'],
        image: '/projects/erp-lubriken/contabilidad-ERP-lubriken.webp',
        alt: 'Accounting module with general ledger and double-entry entries',
      },
      {
        id: 'inventory',
        title: 'Products & Inventory',
        caption:
          'Catalogue, stock and Kardex movements with low-stock alerts and adjustments.',
        path: 'inventory',
        variant: 'inventory',
        badges: ['Kardex', 'Low Stock', 'Catalogue'],
        image: '/projects/erp-lubriken/inventrario-ERP-lubriken.webp',
        alt: 'Products and inventory module with stock and Kardex movements',
      },
      {
        id: 'suppliers',
        title: 'Supplier Management',
        caption: 'Supplier directory with tax ID, contacts, purchases and account status.',
        path: 'suppliers',
        variant: 'analytics',
        badges: ['Suppliers', 'Purchases', 'Tax ID'],
        image: '/projects/erp-lubriken/proveedores-ERP-lubriken.webp',
        alt: 'Supplier management with tax ID, contacts and account status',
      },
      {
        id: 'audit',
        title: 'System Audit',
        caption: 'Access and action log per user, with IP, result and timestamp.',
        path: 'audit',
        variant: 'analytics',
        badges: ['Audit', 'Access', 'Traceability'],
        image: '/projects/erp-lubriken/auditoria-ERP-lubriken.webp',
        alt: 'System audit log with access and actions per user',
      },
      {
        id: 'login',
        title: 'System Login',
        caption: 'Accounting panel authentication with a secure session and access control.',
        path: 'login',
        variant: 'inventory',
        badges: ['Authentication', 'Session', 'Security'],
        image: '/projects/erp-lubriken/login-ERP-lubriken.webp',
        alt: 'Lubriken C.A. sign-in screen',
      },
    ],
    challenge: {
      intro:
        'The accounting close was assembled from spreadsheets that nobody versioned. Entries were duplicated across departments and bank reconciliation was done by hand, without a reliable audit trail.',
      findings: [
        'Duplicate entries from manual imports without idempotency.',
        'Artisanal bank reconciliation: days of work and carry-over errors.',
        'Non-reproducible reports: every close depended on whoever assembled it.',
      ],
    },
    audit: {
      diagnosis:
        'Lubriken operated with a fragmented accounting model: spreadsheets, manual imports and ad hoc reports. There was no idempotency or common audit trail between banks and the general ledger.',
      resolution:
        'A double-entry ledger with hash-based idempotency, assisted reconciliation and reports generated from the same transactional source was implemented. Docker guarantees parity between close and production environments.',
      latencyBefore: '2,980 ms',
      latencyAfter: '64 ms',
      latencyDelta: '−97.9%',
      discrepancy: '0.00%',
      consistencyNote: 'Double-entry balance validated with accounting rules and integrity constraints.',
    },
    modules: [
      {
        code: 'MOD-A',
        title: 'Reactivity',
        subtitle: 'Reactive Accounting Interface',
        description:
          'Dashboards and entries recalculated derivatively, without manual DOM mutations.',
        points: [
          'Entry and report composables',
          'Derived and memoized calculations',
          'Inline editing with validation',
        ],
        icon: 'reactivity',
      },
      {
        code: 'MOD-B',
        title: 'Global State',
        subtitle: 'Predictable State for Entries',
        description:
          'Period, draft and reconciliation stores with action history and optimistic locking.',
        points: [
          'Persistent drafts per period',
          'Optimistic locks per entry',
          'Auditable action history',
        ],
        icon: 'state',
      },
      {
        code: 'MOD-C',
        title: 'Persistence',
        subtitle: 'Double Entry & ACID Integrity',
        description:
          'PostgreSQL with balance constraints, hash idempotency and reproducible migrations.',
        points: [
          'Debit = credit constraints',
          'Idempotency by import hash',
          'Environment parity with Docker',
        ],
        icon: 'database',
      },
    ],
  },
]

const profile: Profile = {
  name: 'Jonathan Campos',
  role: 'Frontend Developer',
  headline: ['WEB DEVELOPER', 'FRONTEND ENGINEER'],
  location: 'Barquisimeto, Venezuela (UTC-4)',
  education: 'Associate Degree in Computer Science (TSU Informática • IUTEPAL)',
  bio: 'Frontend Developer specialized in Vue 3, TypeScript, and modern web architectures. I build reactive, accessible, and resilient interfaces with an offline-first approach and strict typing. Open to remote or hybrid opportunities (Junior / Mid) with immediate availability in UTC-4 timezone.',
  bioAi:
    'I use Artificial Intelligence as a productivity multiplier: accelerating workflows, validating edge cases, auditing accessibility, and polishing user experience.',
  philosophyPath: '~/profile/philosophy.md',
  stats: [
    { label: 'FOCUS', value: 'FRONTEND & PWA' },
    { label: 'CORE STACK', value: 'VUE 3 + TS' },
    { label: 'TIMEZONE', value: 'UTC-4 • REMOTE' },
  ],
  performance: [
    { label: 'PERFORMANCE', value: 98 },
    { label: 'ACCESSIBILITY', value: 100 },
    { label: 'BEST PRACTICES', value: 100 },
    { label: 'SEO', value: 100 },
  ],
  environment: [
    { label: 'OS', value: 'Linux custom kernel' },
    { label: 'EDITOR', value: 'VS Code + Vim' },
    { label: 'DESIGN', value: 'Figma / Penpot' },
    { label: 'RUNTIME', value: 'Node 24 + pnpm' },
    { label: 'LANGUAGES', value: 'Spanish (Native) • English (B1)' },
  ],
}

const contactChannels: readonly ContactChannel[] = [
  {
    id: 'email',
    label: 'DIRECT EMAIL',
    value: 'jonathancamposbusiness@gmail.com',
    href: 'mailto:jonathancamposbusiness@gmail.com',
    description: 'Reply within 24 hours.',
    icon: 'mail',
    actionLabel: 'Send email',
    copyValue: 'jonathancamposbusiness@gmail.com',
  },
  {
    id: 'github',
    label: 'CODEBASE',
    value: 'github.com/jonathanech',
    href: 'https://github.com/jonathanech',
    description: 'Repositories, experiments and open source.',
    icon: 'github',
    actionLabel: 'GitHub Profile',
    external: true,
  },
  {
    id: 'linkedin',
    label: 'NETWORK',
    value: 'linkedin.com/in/jonathanech',
    href: 'https://linkedin.com/in/jonathanech',
    description: 'Career, collaborations and professional contact.',
    icon: 'linkedin',
    actionLabel: 'LinkedIn Sync',
    external: true,
  },
  {
    id: 'whatsapp',
    label: 'INSTANT WIRE',
    value: '+58 4121966931',
    href: 'https://wa.me/584121966931',
    description: 'Instant communication for opportunities.',
    icon: 'whatsapp',
    actionLabel: 'WhatsApp Direct Pulse',
    external: true,
  },
]

export const enContent: PortfolioContent = {
  technologies,
  techFilterOptions,
  projects,
  profile,
  contactChannels,
}
