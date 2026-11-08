import type {
  ContactChannel,
  Profile,
  Project,
  TechFilterOption,
  Technology,
} from '@/types/portfolio'

export const technologies: readonly Technology[] = [
  {
    id: 'vue',
    name: '<Vue 3>',
    category: 'frontend',
    label: 'FRAMEWORK',
    specialties: ['Composition API', 'Pinia'],
    iconKey: 'vue',
    brandColor: '#41B883',
  },
  {
    id: 'typescript',
    name: '[TypeScript]',
    category: 'frontend',
    label: 'LANGUAGE',
    specialties: ['Strict Typing', 'Generics'],
    iconKey: 'typescript',
    brandColor: '#3178C6',
  },
  {
    id: 'tailwind',
    name: '{ Tailwind CSS }',
    category: 'frontend',
    label: 'STYLING ENGINE',
    specialties: ['Design Tokens', 'Utility-First'],
    iconKey: 'tailwind',
    brandColor: '#38BDF8',
  },
  {
    id: 'pinia',
    name: '(Pinia)',
    category: 'frontend',
    label: 'STATE LAYER',
    specialties: ['Offline-First', 'Optimistic Locks'],
    iconKey: 'pinia',
    brandColor: '#FFD859',
  },
  {
    id: 'angular',
    name: '{ Angular }',
    category: 'frontend',
    label: 'FRAMEWORK',
    specialties: ['RxJS', 'Modularity'],
    iconKey: 'angular',
    brandColor: '#DD0031',
  },
  {
    id: 'html',
    name: '(HTML5)',
    category: 'frontend',
    label: 'MARKUP',
    specialties: ['Semantics', 'Accessibility'],
    iconKey: 'html',
    brandColor: '#E34F26',
  },
  {
    id: 'css',
    name: '{ CSS }',
    category: 'frontend',
    label: 'STYLING',
    specialties: ['Grid', 'Animations'],
    iconKey: 'css',
    brandColor: '#663399',
  },
  {
    id: 'javascript',
    name: '[JavaScript]',
    category: 'frontend',
    label: 'LANGUAGE',
    specialties: ['ES2024', 'Async/Await'],
    iconKey: 'javascript',
    brandColor: '#F7DF1E',
  },
  {
    id: 'node',
    name: '<Node.js>',
    category: 'backend',
    label: 'RUNTIME',
    specialties: ['Async I/O', 'REST APIs'],
    iconKey: 'node',
    brandColor: '#5FA04E',
  },
  {
    id: 'express',
    name: '[Express]',
    category: 'backend',
    label: 'FRAMEWORK',
    specialties: ['Middleware', 'Routing'],
    iconKey: 'express',
    brandColor: '#E5E7EB',
  },
  {
    id: 'nestjs',
    name: '{ NestJS }',
    category: 'backend',
    label: 'FRAMEWORK',
    specialties: ['DI Container', 'Modular Arch'],
    iconKey: 'nestjs',
    brandColor: '#E0234E',
  },
  {
    id: 'go',
    name: '<Go>',
    category: 'backend',
    label: 'LANGUAGE',
    specialties: ['Goroutines', 'Channels'],
    iconKey: 'go',
    brandColor: '#00ADD8',
  },
  {
    id: 'php',
    name: '[PHP]',
    category: 'backend',
    label: 'LANGUAGE',
    specialties: ['PSR Standards', 'Composer'],
    iconKey: 'php',
    brandColor: '#777BB4',
  },
  {
    id: 'c',
    name: '<C>',
    category: 'backend',
    label: 'LANGUAGE',
    specialties: ['Memory Control', 'Pointers'],
    iconKey: 'c',
    brandColor: '#A8B9CC',
  },
  {
    id: 'csharp',
    name: '[C#]',
    category: 'backend',
    label: 'LANGUAGE',
    specialties: ['.NET', 'LINQ'],
    iconKey: 'csharp',
    brandColor: '#512BD4',
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'database',
    label: 'DATABASE',
    specialties: ['ACID', 'Query Tuning'],
    iconKey: 'postgresql',
    brandColor: '#4169E1',
  },
  {
    id: 'prisma',
    name: '[Prisma ORM]',
    category: 'database',
    label: 'ORM',
    specialties: ['Type-Safe Client', 'Migrations'],
    iconKey: 'prisma',
    brandColor: '#C9D1E3',
  },
  {
    id: 'docker',
    name: '{ Docker }',
    category: 'devops',
    label: 'CONTAINERS',
    specialties: ['Multi-stage Builds', 'Compose'],
    iconKey: 'docker',
    brandColor: '#2496ED',
  },
  {
    id: 'git',
    name: '<Git>',
    category: 'devops',
    label: 'VERSION CONTROL',
    specialties: ['Trunk-Based', 'Code Review'],
    iconKey: 'git',
    brandColor: '#F05032',
  },
  {
    id: 'pnpm',
    name: '(pnpm)',
    category: 'devops',
    label: 'PACKAGE MANAGER',
    specialties: ['Workspaces', 'Strict Deps'],
    iconKey: 'pnpm',
    brandColor: '#F69220',
  },
  {
    id: 'postman',
    name: '{ Postman }',
    category: 'devops',
    label: 'API TESTING',
    specialties: ['Collections', 'Mock Servers'],
    iconKey: 'postman',
    brandColor: '#FF6C37',
  },
  {
    id: 'vercel',
    name: '<Vercel>',
    category: 'devops',
    label: 'DEPLOYMENT',
    specialties: ['Edge Network', 'Preview Deploys'],
    iconKey: 'vercel',
    brandColor: '#FFFFFF',
  },
  {
    id: 'netlify',
    name: '{ Netlify }',
    category: 'devops',
    label: 'DEPLOYMENT',
    specialties: ['CI/CD', 'Serverless'],
    iconKey: 'netlify',
    brandColor: '#00C7B7',
  },
]

export const techFilterOptions: readonly TechFilterOption[] = [
  { value: 'all', label: 'TODAS // ALL' },
  { value: 'frontend', label: 'FRONTEND' },
  { value: 'backend', label: 'BACKEND & RUNTIMES' },
  { value: 'database', label: 'DATABASES & ORM' },
  { value: 'devops', label: 'DEVOPS & TOOLS' },
]

export const projects: readonly Project[] = [
  {
    slug: 'tilyshop-inventory',
    name: 'TilyShop Inventory',
    sector: 'STOCK AUDIT',
    title: 'TILYSHOP',
    titleHighlight: 'INVENTORY',
    year: '2026',
    status: 'EN PRODUCCIÓN',
    summary:
      'Rediseño integral del inventario textil B2B: trazabilidad atómica de lotes, auditoría transaccional y una capa reactiva offline-first para operaciones de almacén.',
    problem:
      'El sistema previo conciliaba stock con procesos manuales y escrituras no atómicas: lotes duplicados, descuadres silenciosos y consultas críticas de hasta 4,820 ms.',
    techTags: ['Vue 3', 'TypeScript', 'Pinia', 'PostgreSQL', 'Tailwind CSS'],
    role: 'Arquitecto Frontend & Auditor de Lógica de Negocio',
    client: 'Industria Textil & Confección B2B',
    duration: '12 Semanas // Q1-Q2 2026',
    stackKey: 'Vue 3 • TypeScript • PostgreSQL',
    links: {
      demo: 'https://tilyshop-inventory.demo',
      repo: 'https://github.com/jonathanech/tilyshop-inventory',
      whitepaper: '/docs/tilyshop-whitepaper.pdf',
    },
    liveHost: 'tilyshop-inventory.live',
    accent: '#00E5FF',
    galleryDescription:
      'Interfaces reales del flujo operativo: telemetría de almacén, conciliación transaccional y control de lotes en planta.',
    gallery: [
      {
        id: 'telemetry',
        title: 'Panel General & Telemetría',
        caption:
          'Monitor de existencias, flujo de planta y alertas de reposición en tiempo real.',
        path: 'telemetry-view',
        variant: 'inventory',
        badges: ['Almacén Central', 'Auditoría de Lotes', 'Despacho'],
      },
      {
        id: 'ledger',
        title: 'Conciliación & Auditoría Transaccional',
        caption:
          'Doble partida, trazabilidad de lotes y consistencia ACID sobre el ledger inmutable.',
        path: 'ledger-audit',
        variant: 'ledger',
        badges: ['Ledger Inmutable', 'Consistencia ACID', 'Zero-Lag Sync'],
      },
      {
        id: 'batches',
        title: 'Telemetría de Almacén',
        caption:
          'Diagnóstico continuo de terminales RF, scanner hub y control de latencias por lote.',
        path: 'telemetry-view',
        variant: 'batches',
        badges: ['Terminales RF', 'Scanner Hub', 'Concurrencia'],
      },
    ],
    challenge: {
      intro:
        'Antes del rediseño, el inventario agregaba existencias por referencia e ignoraba la granularidad por talla, color y lote. Cada terminal escribía de forma independiente sobre la misma fila, sin bloqueo optimista ni una fuente única de verdad.',
      findings: [
        'Stock agregado por referencia: sin granularidad por talla, color o lote, el inventario físico y el digital divergían de forma silenciosa.',
        'Escrituras no atómicas: dos terminales podían vender la misma unidad y sobrescribir existencias sin bloqueo ni reconciliación.',
        'Lecturas N+1 y ausencia de índices compuestos: el panel de telemetría tardaba hasta 4,820 ms en responder.',
      ],
    },
    audit: {
      diagnosis:
        'El inventario previo conciliaba stock mediante procesos manuales y escrituras no atómicas. Los lotes se agrupaban por referencia, sin granularidad por talla, y las operaciones concurrentes sobrescribían existencias sin bloqueo optimista.',
      resolution:
        'Se rediseñó el modelo de datos con lotes atómicos por SKU y talla, se introdujo un ledger transaccional inmutable y una capa reactiva offline-first con locks optimistas. Las consultas críticas se indexaron y se eliminaron las lecturas N+1.',
      latencyBefore: '4,820 ms',
      latencyAfter: '42 ms',
      latencyDelta: '−99.1%',
      discrepancy: '0.00%',
      consistencyNote: 'Conciliación ACID verificada en 8,412 transacciones de auditoría.',
    },
    modules: [
      {
        code: 'MOD-A',
        title: 'Reactividad',
        subtitle: 'Capa Reactiva con Vue 3 & Composition API',
        description:
          'Componentes desacoplados, estado derivado y watchers quirúrgicos para telemetría en vivo sin re-renderizados innecesarios.',
        points: [
          'Composables tipados por dominio',
          'Estado derivado sin duplicación',
          'Vistas lazy con Suspense',
        ],
        icon: 'reactivity',
      },
      {
        code: 'MOD-B',
        title: 'Estado Global',
        subtitle: 'Gestión de Estado Predictible con Pinia',
        description:
          'Stores por dominio con persistencia offline-first y locks optimistas para operaciones concurrentes de almacén.',
        points: [
          'Offline-first con cola de sincronización',
          'Optimistic locks por SKU y lote',
          'Devtools y trazabilidad de acciones',
        ],
        icon: 'state',
      },
      {
        code: 'MOD-C',
        title: 'Persistencia',
        subtitle: 'Integridad Transaccional & Base de Datos',
        description:
          'PostgreSQL en modo ACID estricto, migraciones versionadas y constraints que hacen imposible el descuadre silencioso.',
        points: [
          'Transacciones ACID por movimiento',
          'Índices compuestos y query tuning',
          'Migraciones y seeds reproducibles',
        ],
        icon: 'database',
      },
    ],
  },
  {
    slug: 'gestion-medica',
    name: 'Sistema de Gestión Médica',
    sector: 'HEALTHCARE SPA',
    title: 'SISTEMA DE GESTIÓN',
    titleHighlight: 'MÉDICA',
    year: '2025',
    status: 'EN PRODUCCIÓN',
    summary:
      'SPA clínica para agenda, expedientes y triaje: flujos de atención sin fricción, estado reactivo y una interfaz accesible para personal médico.',
    problem:
      'La clínica operaba con agendas paralelas y expedientes en papel; las citas se duplicaban y el personal perdía minutos por paciente en tareas repetitivas.',
    techTags: ['Vue 3', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    role: 'Desarrollador Full Stack & Diseñador de Interacción',
    client: 'Red de Clínicas Privadas',
    duration: '16 Semanas // Q3-Q4 2025',
    stackKey: 'Vue 3 • TypeScript • Supabase',
    links: {
      demo: 'https://medicore-clinic.demo',
      repo: 'https://github.com/jonathanech/gestion-medica',
    },
    liveHost: 'medicore-clinic.live',
    accent: '#5EEAD4',
    galleryDescription:
      'Interfaces reales del flujo clínico: agenda de consultorios, expediente unificado y telemetría de ocupación.',
    gallery: [
      {
        id: 'agenda',
        title: 'Agenda Clínica',
        caption:
          'Vista diaria de citas, triaje y ocupación por consultorio con actualización en vivo.',
        path: 'agenda-view',
        variant: 'medical',
        badges: ['Agenda', 'Triaje', 'Tiempo Real'],
      },
      {
        id: 'record',
        title: 'Expediente del Paciente',
        caption:
          'Historial unificado, signos vitales y notas médicas con control de acceso por rol.',
        path: 'patient-record',
        variant: 'medical',
        badges: ['Expediente', 'Acceso por Rol', 'Auditoría'],
      },
      {
        id: 'analytics',
        title: 'Telemetría de Ocupación',
        caption:
          'Métricas de demanda, tiempos de espera y capacidad instalada por especialidad.',
        path: 'analytics-view',
        variant: 'analytics',
        badges: ['Ocupación', 'SLA', 'Analytics'],
      },
    ],
    challenge: {
      intro:
        'La agenda, el triaje y el expediente vivían en sistemas separados. El personal duplicaba datos entre hojas de cálculo y papel, y no existía una vista confiable de la ocupación real de la clínica.',
      findings: [
        'Citas duplicadas por agendas paralelas sin una fuente única de verdad.',
        'Expedientes en papel sin trazabilidad ni control de acceso por rol.',
        'Tiempos de espera invisibles: la clínica no podía medir ni priorizar su demanda.',
      ],
    },
    audit: {
      diagnosis:
        'El flujo clínico dependía de agendas aisladas y registros manuales. La información del paciente se copiaba varias veces y las decisiones de triaje se tomaban sin telemetría de ocupación.',
      resolution:
        'Se unificó el dominio clínico en una SPA con agenda reactiva, expediente único y políticas de acceso por rol. Supabase aportó Row Level Security y realtime para sincronizar consultorios sin polling.',
      latencyBefore: '3,240 ms',
      latencyAfter: '58 ms',
      latencyDelta: '−98.2%',
      discrepancy: '0.02%',
      consistencyNote: 'Trazabilidad de acceso verificada en 2,140 expedientes auditados.',
    },
    modules: [
      {
        code: 'MOD-A',
        title: 'Reactividad',
        subtitle: 'Flujos Clínicos Reactivos',
        description:
          'Vistas de agenda y triaje que reaccionan a cambios de estado sin recargar la sesión del consultorio.',
        points: [
          'Composables de agenda y triaje',
          'Estado derivado por consultorio',
          'Actualizaciones optimistas de citas',
        ],
        icon: 'reactivity',
      },
      {
        code: 'MOD-B',
        title: 'Estado Global',
        subtitle: 'Sincronización de Agenda en Tiempo Real',
        description:
          'Stores de sesión, pacientes y ocupación con canales realtime y resolución de conflictos por versión.',
        points: [
          'Sesión clínica persistente',
          'Realtime por consultorio',
          'Resolución de conflictos por versión',
        ],
        icon: 'state',
      },
      {
        code: 'MOD-C',
        title: 'Persistencia',
        subtitle: 'Expedientes con Row Level Security',
        description:
          'Políticas de acceso a nivel de fila y auditoría inmutable de cada lectura o escritura clínica.',
        points: [
          'RLS por rol y especialidad',
          'Auditoría de accesos',
          'Respaldos y migraciones versionadas',
        ],
        icon: 'database',
      },
    ],
  },
  {
    slug: 'erp-contable',
    name: 'ERP Contable Web',
    sector: 'TRANSACTIONAL ERP',
    title: 'ERP CONTABLE',
    titleHighlight: 'WEB',
    year: '2025',
    status: 'CASO DE ESTUDIO',
    summary:
      'Plataforma contable full-stack con doble partida, conciliación bancaria y reportes financieros reproducibles sobre una base transaccional.',
    problem:
      'El cierre contable dependía de hojas de cálculo desconectadas; los asientos se duplicaban y la conciliación mensual consumía días de trabajo manual.',
    techTags: ['Vue 3', 'Node.js', 'PostgreSQL', 'Docker'],
    role: 'Arquitecto Frontend & Integrador de Dominio Contable',
    client: 'Firma de Servicios Contables',
    duration: '20 Semanas // Q1-Q2 2025',
    stackKey: 'Vue 3 • Node.js • PostgreSQL',
    links: {
      demo: 'https://erp-contable.demo',
      repo: 'https://github.com/jonathanech/erp-contable',
    },
    liveHost: 'erp-contable.live',
    accent: '#A78BFA',
    galleryDescription:
      'Interfaces reales del cierre contable: libro mayor de doble partida, consolidado financiero y telemetría de integridad.',
    gallery: [
      {
        id: 'ledger',
        title: 'Libro Mayor',
        caption:
          'Asientos de doble partida con validación, trazabilidad y centro de costo.',
        path: 'ledger-view',
        variant: 'ledger',
        badges: ['Doble Partida', 'Ledger', 'ACID'],
      },
      {
        id: 'financial',
        title: 'Consolidado Financiero',
        caption:
          'Estado de resultados, flujo de caja y conciliación bancaria en una sola vista.',
        path: 'financial-view',
        variant: 'erp',
        badges: ['Conciliación', 'Cash Flow', 'Cierre'],
      },
      {
        id: 'audit',
        title: 'Telemetría Contable',
        caption:
          'Control de latencia, integridad y volumen transaccional del cierre mensual.',
        path: 'audit-view',
        variant: 'analytics',
        badges: ['Latencia', 'Integridad', 'Auditoría'],
      },
    ],
    challenge: {
      intro:
        'El cierre contable se armaba con hojas de cálculo que nadie versionaba. Los asientos se duplicaban entre áreas y la conciliación bancaria se resolvía a mano, sin una pista de auditoría confiable.',
      findings: [
        'Asientos duplicados por importaciones manuales sin idempotencia.',
        'Conciliación bancaria artesanal: días de trabajo y errores de arrastre.',
        'Reportes no reproducibles: cada cierre dependía del criterio de quien lo armaba.',
      ],
    },
    audit: {
      diagnosis:
        'La firma operaba con un modelo contable fragmentado: hojas de cálculo, importaciones manuales y reportes ad hoc. No existía idempotencia ni una pista de auditoría común entre bancos y libro mayor.',
      resolution:
        'Se implementó un ledger de doble partida con idempotencia por hash, conciliación asistida y reportes generados desde la misma fuente transaccional. Docker garantiza paridad entre entornos de cierre y producción.',
      latencyBefore: '2,980 ms',
      latencyAfter: '64 ms',
      latencyDelta: '−97.9%',
      discrepancy: '0.00%',
      consistencyNote: 'Cierre mensual reproducido en 3 entornos con paridad transaccional.',
    },
    modules: [
      {
        code: 'MOD-A',
        title: 'Reactividad',
        subtitle: 'Interfaz Contable Reactiva',
        description:
          'Tableros y asientos que se recalculan de forma derivada, sin mutaciones manuales del DOM.',
        points: [
          'Composables de asientos y reportes',
          'Cálculos derivados y memoizados',
          'Edición inline con validación',
        ],
        icon: 'reactivity',
      },
      {
        code: 'MOD-B',
        title: 'Estado Global',
        subtitle: 'Estado Predictible para Asientos',
        description:
          'Stores de periodo, borradores y conciliación con historial de acciones y bloqueo optimista.',
        points: [
          'Borradores persistentes por periodo',
          'Locks optimistas por asiento',
          'Historial de acciones auditable',
        ],
        icon: 'state',
      },
      {
        code: 'MOD-C',
        title: 'Persistencia',
        subtitle: 'Doble Partida & Integridad ACID',
        description:
          'PostgreSQL con constraints de balance, idempotencia por hash y migraciones reproducibles.',
        points: [
          'Constraints de débito = crédito',
          'Idempotencia por hash de importación',
          'Paridad de entornos con Docker',
        ],
        icon: 'database',
      },
    ],
  },
]

export const profile: Profile = {
  name: 'Jonathan Campos',
  role: 'Desarrollador Web Frontend',
  headline: ['DESARROLLADOR WEB FRONTEND', 'ARQUITECTO DE SOFTWARE'],
  location: 'Barquisimeto, Venezuela',
  education: 'TSU en Informática',
  bio: 'Soy estudiante de Informática (TSU) radicado en Barquisimeto, Venezuela. Combino interfaces modernas con una evaluación estricta de la lógica de negocio: audito cuellos de botella, prevengo errores logísticos en bases de datos y diseño sistemas que no fallan en silencio. Fuera del código, optimizo entornos Linux y calibro variables de extracción de espresso.',
  philosophyPath: '~/profile/philosophy.md',
  stats: [
    { label: 'AUDITORÍA', value: 'TÉCNICA' },
    { label: 'STACK', value: 'VUE 3 + TS' },
    { label: 'BASE', value: 'BARQUISIMETO, VE' },
  ],
  performance: [
    { label: 'RENDIMIENTO', value: 98 },
    { label: 'ACCESIBILIDAD', value: 100 },
    { label: 'BUENAS PRÁCTICAS', value: 100 },
    { label: 'SEO', value: 100 },
  ],
  environment: [
    { label: 'OS', value: 'Linux custom kernel' },
    { label: 'EDITOR', value: 'VS Code + Vim' },
    { label: 'DISEÑO', value: 'Figma / Penpot' },
    { label: 'RUNTIME', value: 'Node 24 + pnpm' },
    { label: 'CAFÉ', value: 'Espresso calibration lab' },
  ],
}

export const contactChannels: readonly ContactChannel[] = [
  {
    id: 'email',
    label: 'CORREO DIRECTO',
    value: 'jonathancamposbusiness@gmail.com',
    href: 'mailto:jonathancamposbusiness@gmail.com',
    description: 'Respuesta en menos de 24 horas.',
    icon: 'mail',
    actionLabel: 'Enviar correo',
    copyValue: 'jonathancamposbusiness@gmail.com',
  },
  {
    id: 'github',
    label: 'CODEBASE',
    value: 'github.com/jonathanech',
    href: 'https://github.com/jonathanech',
    description: 'Repositorios, experimentos y código abierto.',
    icon: 'github',
    actionLabel: 'GitHub Profile',
    external: true,
  },
  {
    id: 'linkedin',
    label: 'NETWORK',
    value: 'linkedin.com/in/jonathanech',
    href: 'https://linkedin.com/in/jonathanech',
    description: 'Trayectoria, colaboraciones y contacto profesional.',
    icon: 'linkedin',
    actionLabel: 'LinkedIn Sync',
    external: true,
  },
  {
    id: 'whatsapp',
    label: 'INSTANT WIRE',
    value: '+58 4121966931',
    href: 'https://wa.me/584121966931',
    description: 'Comunicación instantánea para oportunidades.',
    icon: 'whatsapp',
    actionLabel: 'WhatsApp Pulse Directo',
    external: true,
  },
]
