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
      {title: 'Agent Suite', description: 'Light, Climate, Scene, Music, Timer, Lists, Sensor, Security, and General agents', icon: '🎯'},
      {title: 'Unified Entity System', description: 'HybridEntityMatcher with Levenshtein, Jaro-Winkler, phonetic, and embedding similarity', icon: '🔍'},
      {title: 'Home Assistant Integration', description: 'Custom component with REST Conversation API and automatic agent routing', icon: '🏠'},
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
      {title: 'Scheduled Tasks', description: 'Extensible CRON-based scheduler with pluggable persistence', icon: '📅'},
      {title: 'A2A Protocol', description: 'Agent-to-Agent communication via JSON-RPC 2.0 for satellite agents', icon: '🔗'},
    ],
  },
  {
    status: 'completed',
    label: 'Shipped',
    title: 'v1.2.0 "Pulsar" Release',
    description: 'Wyoming Voice Platform, Conversation Command Parser, and Pluggable Data Providers — shipped in March 2026.',
    items: [
      {title: 'Wyoming Voice Platform', description: 'Local speech-to-text, speaker verification, wake words, speech enhancement, multi-engine STT, ONNX auto-detection', icon: '🎙️'},
      {title: 'Conversation Command Parser', description: 'Fast-path pattern matching for lights, climate, scenes with sub-50ms execution and LLM fallback', icon: '⚡'},
      {title: 'Personality Prompt', description: 'Customizable AI personality with optional separate model for response rewriting', icon: '🎭'},
      {title: 'Response Templates', description: 'Customizable command response templates with placeholder interpolation and skill grouping', icon: '📝'},
      {title: 'Pluggable Data Providers', description: 'InMemory and SQLite alternatives to Redis/MongoDB for resource-constrained deployments', icon: '🗄️'},
      {title: 'Home Assistant Mono-Container', description: 'Zero-dependency Dockerfile.ha for single-container add-on deployment', icon: '🏠'},
    ],
  },
  {
    status: 'completed',
    label: 'Shipped',
    title: 'v1.2.1 "Searchlight" Release',
    description: 'Orchestrator quality improvements and expanded evaluation suite — shipped in April 2026.',
    items: [
      {title: 'Orchestrator Eval Suite', description: '56 YAML scenarios covering all 7 agent types with cross-domain confusion tests', icon: '🔦'},
      {title: 'Router Prompt Engineering', description: 'Small-model compatibility with time-delayed action priority and domain inference hints', icon: '🧠'},
      {title: 'Timer Agent Routing', description: 'Full timer/scheduler/alarm routing support with cross-domain guards', icon: '⏱️'},
    ],
  },
  {
    status: 'completed',
    label: 'Shipped',
    title: 'v1.2.3 Release',
    description: 'New agents, memory, PostgreSQL, and production hardening — shipped in July 2026.',
    items: [
      {title: 'Sensor Agent', description: 'Read-only sensor and binary-sensor queries with hybrid entity matching', icon: '🌡️'},
      {title: 'Security Agent', description: 'Alarm panel and lock control with verified status reporting', icon: '🔐'},
      {title: 'Per-User Memory', description: 'Durable user context with authenticated management APIs', icon: '💾'},
      {title: 'PostgreSQL Provider', description: 'Production persistence for configuration, traces, tasks, voice profiles, and memory', icon: '🐘'},
      {title: 'Production Hardening', description: 'Safer Docker, authentication, voice buffering, task timeouts, and dashboard errors', icon: '🛡️'},
    ],
  },
  {
    status: 'completed',
    label: 'Shipped',
    title: 'v1.3.0–v1.3.1 Releases',
    description: 'Observability, Jetson voice, dashboard themes, and voice performance — shipped in August 2026.',
    items: [
      {title: 'Remote Observability', description: 'OpenTelemetry, Grafana, Tempo, Prometheus, Loki, and Caddy stack', icon: '📈'},
      {title: 'Jetson CUDA Voice', description: 'Reproducible ARM64 deployment with PostgreSQL, Redis, and infrastructure telemetry', icon: '🚀'},
      {title: 'Dashboard Themes', description: 'Accessible System, Light, and Dark preferences with pre-paint resolution', icon: '☀️'},
      {title: 'Speech Pipeline Metrics', description: 'Queue, STT, enhancement, diarization, and transcript-write timing', icon: '📊'},
      {title: 'Speaker Benchmarks', description: 'Reproducible speaker-verification model comparison and reports', icon: '🎙️'},
      {title: 'Voice Efficiency', description: 'Bounded STT concurrency, graceful shutdown, reusable buffers, and optional pipelines', icon: '⚡'},
    ],
  },
  {
    status: 'completed',
    label: 'Shipped',
    title: 'v1.4.0 Appliance OS',
    description: 'A guided, native Jetson installation shipped in September 2026.',
    items: [
      {title: 'Flashable Installer', description: 'microSD installer with verified, device-bound NVMe erase approval', icon: '💾'},
      {title: 'Captive Setup Portal', description: 'Phone-friendly Wi-Fi, storage, hostname, and recovery setup', icon: '📱'},
      {title: 'Native GPU Voice', description: 'Pinned CUDA, ONNX Runtime, sherpa-onnx, and speech model assets', icon: '🎙️'},
      {title: 'A/B Operating System', description: 'Two Jetson Linux slots with separate application and persistent data partitions', icon: '🔁'},
      {title: 'Appliance Management', description: 'Service status, restart, reboot, telemetry, and release discovery in the dashboard', icon: '🛠️'},
    ],
  },
  {
    status: 'in-progress',
    label: 'In Progress',
    title: 'v1.4.1 In Progress',
    description: 'Signed appliance updates and rollback are under active development.',
    items: [
      {title: 'Signed Appliance Updates', description: 'Manifest and GitHub attestation checks before any app or OS write', icon: '✍️'},
      {title: 'App Update Rollback', description: 'Versioned release switch with data backup and health-gated recovery', icon: '↩️'},
      {title: 'A/B OS Automation', description: 'Inactive-slot install, first-boot validation, and automatic fallback', icon: '🔄'},
      {title: 'Calendar Agent', description: 'New calendar agent for event management and scheduling', icon: '📅'},
      {title: 'Voice Segmentation Benchmarks', description: 'Measure bounded-clip segmentation before full diarization', icon: '🎙️'},
    ],
  },
  {
    status: 'planned',
    label: 'Planned',
    title: 'Future Vision',
    description: 'Long-term goals on the horizon.',
    items: [
      {title: 'Local LLM Optimization', description: 'Quantization profiles and prompt tuning for best local model performance with Ollama', icon: '🚀'},
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
