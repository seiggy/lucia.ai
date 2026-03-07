import type {ReactNode} from 'react';
import styles from './styles.module.css';

type Status = 'completed' | 'in-progress' | 'planned';

interface RoadmapItem {
  title: string;
  description: string;
  icon?: string;
}

interface RoadmapPhase {
  status: Status;
  label: string;
  title: string;
  description?: string;
  items: RoadmapItem[];
}

const phases: RoadmapPhase[] = [
  {
    status: 'completed',
    label: 'Shipped',
    title: 'Core Platform',
    description: 'Foundation and agent framework — all delivered and running in production.',
    items: [
      {title: 'Multi-Agent Orchestration', description: 'Router, dispatcher, and aggregator pipeline with semantic intent matching', icon: '🤖'},
      {title: 'Agent Suite', description: 'Light, Climate, Scene, Music, Timer, Lists, and General agents', icon: '🎯'},
      {title: 'Unified Entity System', description: 'HybridEntityMatcher with Levenshtein, Jaro-Winkler, phonetic, and embedding similarity', icon: '🔍'},
      {title: 'Home Assistant Integration', description: 'Custom component with Conversation API, JSON-RPC, and agent selection', icon: '🏠'},
      {title: 'Management Dashboard', description: 'React 19 SPA with 20+ pages — traces, agents, config, exports, entity management', icon: '📊'},
      {title: 'Model Provider System', description: 'Azure OpenAI, OpenAI, Ollama, Anthropic, Gemini — per-agent assignment', icon: '🧠'},
    ],
  },
  {
    status: 'completed',
    label: 'Shipped',
    title: 'Extensibility & Infrastructure',
    description: 'Plugin system, deployment options, and developer tooling.',
    items: [
      {title: 'Plugin System', description: 'Roslyn script plugins with four-hook lifecycle and repository management', icon: '🔌'},
      {title: 'MCP Tool Servers', description: 'Model Context Protocol integration for stdio and HTTP/SSE tool servers', icon: '🛠️'},
      {title: 'Prompt Caching', description: 'Two-tier cache with split routing/chat thresholds and hot-reload', icon: '⚡'},
      {title: 'Kubernetes & Helm', description: 'Mesh-mode deployment with manifests, Helm charts, and systemd units', icon: '☸️'},
      {title: 'OpenTelemetry', description: 'Distributed tracing and metrics across the full agent pipeline', icon: '📡'},
      {title: 'Dataset Export', description: 'Conversation traces with human corrections for fine-tuning and RLHF', icon: '📦'},
    ],
  },
  {
    status: 'completed',
    label: 'Shipped',
    title: 'Smart Home Features',
    description: 'Alarm, presence, setup wizard, and entity visibility.',
    items: [
      {title: 'Setup Wizard', description: 'Guided onboarding with AI provider config, agent health gate, and HA connection', icon: '🧙'},
      {title: 'Alarm Clock System', description: 'CRON-scheduled alarms with volume ramping, voice dismissal/snooze', icon: '⏰'},
      {title: 'Presence Detection', description: 'Auto-discovered sensors with room-level confidence scoring', icon: '📡'},
      {title: 'Entity Visibility', description: 'Per-entity visibility controls with HA exposed entity list via WebSocket', icon: '👁️'},
      {title: 'Scheduled Tasks', description: 'Extensible CRON-based scheduler with MongoDB persistence', icon: '📅'},
      {title: 'A2A Protocol', description: 'Agent-to-Agent communication via JSON-RPC 2.0 for satellite agents', icon: '🔗'},
    ],
  },
  {
    status: 'in-progress',
    label: 'In Progress',
    title: 'Current Sprint',
    description: 'Active development — these features are being built now.',
    items: [
      {title: 'WebSocket Real-Time Events', description: 'Persistent WebSocket connection to Home Assistant for live entity state updates', icon: '🔌'},
      {title: 'Data Provider Abstraction', description: 'Support for SQLite and PostgreSQL as data providers in addition to MongoDB', icon: '🗄️'},
      {title: 'CalendarAgent', description: 'Calendar management with event creation, availability checking, and daily briefings', icon: '📅'},
      {title: 'SecurityAgent', description: 'Security system monitoring — arm/disarm, camera snapshots, and alerts', icon: '🔐'},
    ],
  },
  {
    status: 'planned',
    label: 'Planned',
    title: 'Future Vision',
    description: 'Long-term goals on the horizon.',
    items: [
      {title: 'Home Assistant App', description: 'Mono-container deployment running directly as a Home Assistant add-on', icon: '🏠'},
      {title: 'Local LLM Optimization', description: 'Quantization profiles and prompt tuning for best local model performance with Ollama', icon: '🚀'},
      {title: 'Voice Integration', description: 'Local speech-to-text and text-to-speech pipelines for fully voice-first interaction', icon: '🎤'},
      {title: 'GitHub Copilot SDK', description: 'First-class LLM provider integration with the GitHub Copilot SDK', icon: '🤝'},
      {title: 'Mobile Companion App', description: 'Native iOS and Android app for remote control and monitoring', icon: '📱'},
    ],
  },
];

function StatusBadge({status}: {status: Status}) {
  return (
    <span className={`${styles.badge} ${styles[`badge--${status}`]}`}>
      {status === 'completed' && '✓ Shipped'}
      {status === 'in-progress' && '◔ In Progress'}
      {status === 'planned' && '○ Planned'}
    </span>
  );
}

function PhaseCard({phase, index}: {phase: RoadmapPhase; index: number}) {
  return (
    <div className={`${styles.phase} ${styles[`phase--${phase.status}`]}`}>
      <div className={styles.timelineNode}>
        <div className={`${styles.dot} ${styles[`dot--${phase.status}`]}`} />
        {index < phases.length - 1 && <div className={styles.line} />}
      </div>
      <div className={styles.phaseContent}>
        <div className={styles.phaseHeader}>
          <StatusBadge status={phase.status} />
          <h2 className={styles.phaseTitle}>{phase.title}</h2>
          {phase.description && (
            <p className={styles.phaseDescription}>{phase.description}</p>
          )}
        </div>
        <div className={styles.itemGrid}>
          {phase.items.map((item, i) => (
            <div key={i} className={`${styles.item} ${styles[`item--${phase.status}`]}`}>
              {item.icon && <span className={styles.itemIcon}>{item.icon}</span>}
              <div>
                <strong className={styles.itemTitle}>{item.title}</strong>
                <p className={styles.itemDescription}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProgressBar() {
  const total = phases.reduce((sum, p) => sum + p.items.length, 0);
  const completed = phases
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.items.length, 0);
  const inProgress = phases
    .filter(p => p.status === 'in-progress')
    .reduce((sum, p) => sum + p.items.length, 0);
  const pctComplete = Math.round((completed / total) * 100);
  const pctInProgress = Math.round((inProgress / total) * 100);

  return (
    <div className={styles.progressSection}>
      <div className={styles.progressStats}>
        <div className={styles.stat}>
          <span className={styles.statNumber}>{completed}</span>
          <span className={styles.statLabel}>Shipped</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNumber}>{inProgress}</span>
          <span className={styles.statLabel}>In Progress</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNumber}>{total - completed - inProgress}</span>
          <span className={styles.statLabel}>Planned</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNumber}>{pctComplete}%</span>
          <span className={styles.statLabel}>Complete</span>
        </div>
      </div>
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{width: `${pctComplete}%`}} />
        <div className={styles.progressActive} style={{width: `${pctInProgress}%`}} />
      </div>
    </div>
  );
}

export default function Roadmap(): ReactNode {
  return (
    <div className={styles.roadmap}>
      <ProgressBar />
      <div className={styles.timeline}>
        {phases.map((phase, i) => (
          <PhaseCard key={i} phase={phase} index={i} />
        ))}
      </div>
    </div>
  );
}
