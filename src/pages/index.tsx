import type {ReactNode} from 'react';
import {useEffect, useMemo, useRef, useState} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import * as Tooltip from '@radix-ui/react-tooltip';
import dagre from '@dagrejs/dagre';
import {
  Background,
  MarkerType,
  Position,
  ReactFlow,
  type ReactFlowInstance,
  type Edge,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import styles from './index.module.css';
import {
  AlarmClock,
  Bot,
  Container,
  Cpu,
  Lightbulb,
  ListTodo,
  MessageCircle,
  Minus,
  Music2,
  PlugZap,
  Shield,
  Speaker,
  Sparkles,
  Square,
  Thermometer,
  X,
} from 'lucide-react';

function HomeAssistantLogo() {
  return (
    <svg viewBox="0 0 24 24" width="40" height="40" fill="#18bcf2">
      <path d="M11.9922 1.3945a.7041.7041 0 00-.498.211L.1621 13.0977A.5634.5634 0 000 13.494a.567.567 0 00.5664.5664H2.67v8.0743c0 .2603.2104.4707.4707.4707h7.9473v-3.6836L8.037 15.8672a2.42 2.42 0 01-.9473.1933c-1.3379 0-2.4218-1.0868-2.4218-2.4257 0-1.339 1.084-2.4239 2.4218-2.4239 1.338 0 2.422 1.085 2.422 2.4239 0 .3359-.068.6563-.1915.9472l1.7676 1.7676v-5.375C10.2 10.615 9.5723 9.744 9.5723 8.7266c0-1.339 1.0859-2.4258 2.4238-2.4258 1.338 0 2.4219 1.0868 2.4219 2.4258 0 1.0174-.6259 1.8884-1.5137 2.248v5.375l1.7656-1.7676a2.4205 2.4205 0 01-.1914-.9472c0-1.339 1.086-2.4239 2.4238-2.4239 1.338 0 2.422 1.085 2.422 2.4239 0 1.3389-1.084 2.4257-2.422 2.4257a2.42 2.42 0 01-.9472-.1933l-3.0508 3.0547v3.6836h7.9473a.4702.4702 0 00.4707-.4707v-8.0743h2.1113a.5686.5686 0 00.3965-.162c.2233-.2185.2262-.5775.0078-.8008l-2.5156-2.5723V6.4707c0-.2603-.2104-.4727-.4707-.4727h-1.9649c-.2603 0-.4707.2124-.4707.4727v1.1035L12.5 1.6035a.7056.7056 0 00-.5078-.209zm.0039 6.3614c-.5352 0-.9688.4351-.9688.9707 0 .5355.4336.9687.9688.9687a.9683.9683 0 00.9687-.9687c0-.5356-.4335-.9707-.9687-.9707zM7.0898 12.666a.9683.9683 0 00-.9687.9688c0 .5355.4336.9707.9687.9707.5352 0 .9688-.4352.9688-.9707a.9683.9683 0 00-.9688-.9688zm9.8125 0c-.5351 0-.9707.4332-.9707.9688 0 .5355.4356.9707.9707.9707.5352 0 .9688-.4352.9688-.9707a.9683.9683 0 00-.9688-.9688Z" />
    </svg>
  );
}

const features: {title: string; icon: ReactNode; description: string}[] = [
  {
    title: 'Multi-Agent Orchestration',
    icon: '🤖',
    description:
      'Router, dispatcher, and aggregator coordinate specialized agents end-to-end using the A2A protocol where needed.',
  },
  {
    title: 'Natural-Language Control',
    icon: '🧠',
    description:
      'Lucia maps everyday language to Home Assistant entities, areas, and automations without rigid command syntax.',
  },
  {
    title: 'Privacy-First By Design',
    icon: '🔒',
    description:
      'Run local with Ollama, hybrid, or cloud-backed. Your data path is configurable to match your trust model.',
  },
  {
    title: 'Deep Home Assistant Integration',
    icon: <HomeAssistantLogo />,
    description:
      'Custom component integration with Home Assistant Conversation API and JSON-RPC communication to Lucia AgentHost.',
  },
  {
    title: 'Operational Dashboard',
    icon: '📊',
    description:
      'Inspect agents, traces, configuration, providers, exports, and diagnostics from one focused control plane.',
  },
  {
    title: 'Extensible Plugin System',
    icon: '🔌',
    description:
      'Add custom agents, tools, and integrations through Lucia plugins and repositories.',
  },
];

interface Provider {
  name: string;
  logo: ReactNode;
  color: string;
}

function OpenAILogo() {
  return (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
    </svg>
  );
}

function AnthropicLogo() {
  return (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
      <path d="M17.304 3.541h-3.677l6.631 16.918h3.677zm-10.608 0L.065 20.459h3.743l1.362-3.604h6.98l1.362 3.604h3.742L10.624 3.541zm-.489 10.523 2.106-5.58 2.106 5.58z" />
    </svg>
  );
}

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" width="32" height="32">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function OllamaLogo() {
  return (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
      <path d="M16.361 10.26a.894.894 0 0 0-.558.47l-.072.148.001.207c0 .193.004.217.059.353.076.193.152.312.291.448.24.238.51.3.872.205a.86.86 0 0 0 .517-.436.752.752 0 0 0 .08-.498c-.064-.453-.33-.782-.724-.897a1.06 1.06 0 0 0-.466 0zm-9.203.005c-.305.096-.533.32-.65.639a1.187 1.187 0 0 0-.06.52c.057.309.31.59.598.667.362.095.632.033.872-.205.14-.136.215-.255.291-.448.055-.136.059-.16.059-.353l.001-.207-.072-.148a.894.894 0 0 0-.565-.472 1.02 1.02 0 0 0-.474.007Zm4.184 2c-.131.071-.223.25-.195.383.031.143.157.288.353.407.105.063.112.072.117.136.004.038-.01.146-.029.243-.02.094-.036.194-.036.222.002.074.07.195.143.253.064.052.076.054.255.059.164.005.198.001.264-.03.169-.082.212-.234.15-.525-.052-.243-.042-.28.087-.355.137-.08.281-.219.324-.314a.365.365 0 0 0-.175-.48.394.394 0 0 0-.181-.033c-.126 0-.207.03-.355.124l-.085.053-.053-.032c-.219-.13-.259-.145-.391-.143a.396.396 0 0 0-.193.032zm.39-2.195c-.373.036-.475.05-.654.086-.291.06-.68.195-.951.328-.94.46-1.589 1.226-1.787 2.114-.04.176-.045.234-.045.53 0 .294.005.357.043.524.264 1.16 1.332 2.017 2.714 2.173.3.033 1.596.033 1.896 0 1.11-.125 2.064-.727 2.493-1.571.114-.226.169-.372.22-.602.039-.167.044-.23.044-.523 0-.297-.005-.355-.045-.531-.288-1.29-1.539-2.304-3.072-2.497a6.873 6.873 0 0 0-.855-.031zm.645.937a3.283 3.283 0 0 1 1.44.514c.223.148.537.458.671.662.166.251.26.508.303.82.02.143.01.251-.043.482-.08.345-.332.705-.672.957a3.115 3.115 0 0 1-.689.348c-.382.122-.632.144-1.525.138-.582-.006-.686-.01-.853-.042-.57-.107-1.022-.334-1.35-.68-.264-.28-.385-.535-.45-.946-.03-.192.025-.509.137-.776.136-.326.488-.73.836-.963.403-.269.934-.46 1.422-.512.187-.02.586-.02.773-.002zm-5.503-11a1.653 1.653 0 0 0-.683.298C5.617.74 5.173 1.666 4.985 2.819c-.07.436-.119 1.04-.119 1.503 0 .544.064 1.24.155 1.721.02.107.031.202.023.208a8.12 8.12 0 0 1-.187.152 5.324 5.324 0 0 0-.949 1.02 5.49 5.49 0 0 0-.94 2.339 6.625 6.625 0 0 0-.023 1.357c.091.78.325 1.438.727 2.04l.13.195-.037.064c-.269.452-.498 1.105-.605 1.732-.084.496-.095.629-.095 1.294 0 .67.009.803.088 1.266.095.555.288 1.143.503 1.534.071.128.243.393.264.407.007.003-.014.067-.046.141a7.405 7.405 0 0 0-.548 1.873c-.062.417-.071.552-.071.991 0 .56.031.832.148 1.279L3.42 24h1.478l-.05-.091c-.297-.552-.325-1.575-.068-2.597.117-.472.25-.819.498-1.296l.148-.29v-.177c0-.165-.003-.184-.057-.293a.915.915 0 0 0-.194-.25 1.74 1.74 0 0 1-.385-.543c-.424-.92-.506-2.286-.208-3.451.124-.486.329-.918.544-1.154a.787.787 0 0 0 .223-.531c0-.195-.07-.355-.224-.522a3.136 3.136 0 0 1-.817-1.729c-.14-.96.114-2.005.69-2.834.563-.814 1.353-1.336 2.237-1.475.199-.033.57-.028.776.01.226.04.367.028.512-.041.179-.085.268-.19.374-.431.093-.215.165-.333.36-.576.234-.29.46-.489.822-.729.413-.27.884-.467 1.352-.561.17-.035.25-.04.569-.04.319 0 .398.005.569.04a4.07 4.07 0 0 1 1.914.997c.117.109.398.457.488.602.034.057.095.177.132.267.105.241.195.346.374.43.14.068.286.082.503.045.343-.058.607-.053.943.016 1.144.23 2.14 1.173 2.581 2.437.385 1.108.276 2.267-.296 3.153-.097.15-.193.27-.333.419-.301.322-.301.722-.001 1.053.493.539.801 1.866.708 3.036-.062.772-.26 1.463-.533 1.854a2.096 2.096 0 0 1-.224.258.916.916 0 0 0-.194.25c-.054.109-.057.128-.057.293v.178l.148.29c.248.476.38.823.498 1.295.253 1.008.231 2.01-.059 2.581a.845.845 0 0 0-.044.098c0 .006.329.009.732.009h.73l.02-.074.036-.134c.019-.076.057-.3.088-.516.029-.217.029-1.016 0-1.258-.11-.875-.295-1.57-.597-2.226-.032-.074-.053-.138-.046-.141.008-.005.057-.074.108-.152.376-.569.607-1.284.724-2.228.031-.26.031-1.378 0-1.628-.083-.645-.182-1.082-.348-1.525a6.083 6.083 0 0 0-.329-.7l-.038-.064.131-.194c.402-.604.636-1.262.727-2.04a6.625 6.625 0 0 0-.024-1.358 5.512 5.512 0 0 0-.939-2.339 5.325 5.325 0 0 0-.95-1.02 8.097 8.097 0 0 1-.186-.152.692.692 0 0 1 .023-.208c.208-1.087.201-2.443-.017-3.503-.19-.924-.535-1.658-.98-2.082-.354-.338-.716-.482-1.15-.455-.996.059-1.8 1.205-2.116 3.01a6.805 6.805 0 0 0-.097.726c0 .036-.007.066-.015.066a.96.96 0 0 1-.149-.078A4.857 4.857 0 0 0 12 3.03c-.832 0-1.687.243-2.456.698a.958.958 0 0 1-.148.078c-.008 0-.015-.03-.015-.066a6.71 6.71 0 0 0-.097-.725C8.997 1.392 8.337.319 7.46.048a2.096 2.096 0 0 0-.585-.041Zm.293 1.402c.248.197.523.759.682 1.388.03.113.06.244.069.292.007.047.026.152.041.233.067.365.098.76.102 1.24l.002.475-.12.175-.118.178h-.278c-.324 0-.646.041-.954.124l-.238.06c-.033.007-.038-.003-.057-.144a8.438 8.438 0 0 1 .016-2.323c.124-.788.413-1.501.696-1.711.067-.05.079-.049.157.013zm9.825-.012c.17.126.358.46.498.888.28.854.36 2.028.212 3.145-.019.14-.024.151-.057.144l-.238-.06a3.693 3.693 0 0 0-.954-.124h-.278l-.119-.178-.119-.175.002-.474c.004-.669.066-1.19.214-1.772.157-.623.434-1.185.68-1.382.078-.062.09-.063.159-.012z" />
    </svg>
  );
}

function MicrosoftLogo() {
  return (
    <svg viewBox="0 0 23 23" width="32" height="32">
      <rect x="1" y="1" width="10" height="10" fill="#f25022" />
      <rect x="12" y="1" width="10" height="10" fill="#7fba00" />
      <rect x="1" y="12" width="10" height="10" fill="#00a4ef" />
      <rect x="12" y="12" width="10" height="10" fill="#ffb900" />
    </svg>
  );
}

function OpenRouterLogo() {
  return (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
      <path d="M16.778 1.844v1.919q-.569-.026-1.138-.032-.708-.008-1.415.037c-1.93.126-4.023.728-6.149 2.237-2.911 2.066-2.731 1.95-4.14 2.75-.396.223-1.342.574-2.185.798-.841.225-1.753.333-1.751.333v4.229s.768.108 1.61.333c.842.224 1.789.575 2.185.799 1.41.798 1.228.683 4.14 2.75 2.126 1.509 4.22 2.11 6.148 2.236.88.058 1.716.041 2.555.005v1.918l7.222-4.168-7.222-4.17v2.176c-.86.038-1.611.065-2.278.021-1.364-.09-2.417-.357-3.979-1.465-2.244-1.593-2.866-2.027-3.68-2.508.889-.518 1.449-.906 3.822-2.59 1.56-1.109 2.614-1.377 3.978-1.466.667-.044 1.418-.017 2.278.02v2.176L24 6.014Z" />
    </svg>
  );
}

const providers: Provider[] = [
  {name: 'OpenAI', logo: <OpenAILogo />, color: '#10a37f'},
  {name: 'Azure OpenAI', logo: <MicrosoftLogo />, color: '#0078d4'},
  {name: 'Azure AI Inference', logo: <MicrosoftLogo />, color: '#0078d4'},
  {name: 'Anthropic', logo: <AnthropicLogo />, color: '#d4a27f'},
  {name: 'Google Gemini', logo: <GoogleLogo />, color: '#4285f4'},
  {name: 'Ollama', logo: <OllamaLogo />, color: '#ffffff'},
  {name: 'OpenRouter', logo: <OpenRouterLogo />, color: '#6366f1'},
];

const dashboardScreenshots = [
  {src: '/img/dashboard/activity.png', alt: 'Activity Dashboard', caption: 'Live activity stream and system events'},
  {src: '/img/dashboard/agents.png', alt: 'Agent Registry', caption: 'Agent management and definitions'},
  {src: '/img/dashboard/traces.png', alt: 'Traces', caption: 'Conversation-level traces and diagnostics'},
  {src: '/img/dashboard/configuration.png', alt: 'Configuration', caption: 'Config and environment settings'},
  {src: '/img/dashboard/model-providers.png', alt: 'Model Providers', caption: 'Provider and model controls'},
];

const orchestrationSteps = [
  {
    title: 'Input arrives in Home Assistant',
    description:
      'Voice or text enters through Assist, dashboard widgets, or a connected satellite.',
  },
  {
    title: 'Conversation API forwards to Lucia',
    description:
      'The Lucia custom component passes the request to AgentHost over JSON-RPC.',
  },
  {
    title: 'Router selects the best-fit agent',
    description:
      'AgentHost dispatches to specialized agents such as lighting, climate, scenes, lists, or general fallback.',
  },
  {
    title: 'Result returns to Home Assistant',
    description:
      'Response and actions flow back through the same path for speech output or UI display.',
  },
];

const agentCards = [
  {name: 'LightAgent', focus: 'Lights, brightness, color, color temperature'},
  {name: 'ClimateAgent', focus: 'Thermostat mode, targets, climate status'},
  {name: 'SceneAgent', focus: 'Scenes and automation triggers'},
  {name: 'ListsAgent', focus: 'Shopping lists, todos, notes'},
  {name: 'GeneralAgent', focus: 'Fallback and general conversation'},
  {name: 'MusicAgent', focus: 'Media playback and queue control'},
  {name: 'TimerAgent', focus: 'Default A2A-hosted satellite agent'},
];

type DemoStep = {
  id: string;
  label: string;
  detail: string;
  durationMs: number;
  routeIndex: number;
};

type DemoScenario = {
  id: string;
  title: string;
  prompt: string;
  result: string;
  route: string[];
  traceSource: string;
  selectedAgentId: string;
  confidence: number;
  totalDurationMs: number;
  steps: DemoStep[];
};

function formatDurationMs(durationMs: number): string {
  if (durationMs >= 10000) {
    return `${(durationMs / 1000).toFixed(1)}s`;
  }
  if (durationMs >= 1000) {
    return `${(durationMs / 1000).toFixed(2)}s`;
  }
  return `${Math.round(durationMs)}ms`;
}

const scenarioData: DemoScenario[] = [
  {
    id: 'trace-lights',
    title: 'Trace replay: Office lights',
    prompt: 'Turn on the office lights.',
    result: 'Done — office lights turned on.',
    route: [
      'Home Assistant',
      'Conversation API',
      'Lucia Router',
      'light-agent',
      'Light control tools',
      'Response',
    ],
    traceSource: 'trace.json',
    selectedAgentId: 'light-agent',
    confidence: 0.95,
    totalDurationMs: 1744.806,
    steps: [
      {
        id: 'lights-ingress',
        label: 'Ingress + routing handoff',
        detail: 'Conversation API forwards the request into Lucia orchestration.',
        durationMs: 7,
        routeIndex: 1,
      },
      {
        id: 'lights-route',
        label: 'Cached router decision',
        detail:
          'Prompt-cache exact match returns a cached route, selecting light-agent without full router LLM latency.',
        durationMs: 5.1,
        routeIndex: 2,
      },
      {
        id: 'lights-plan',
        label: 'Agent planning round',
        detail: 'light-agent generates the execution plan (planning ChatCache round).',
        durationMs: 1140.7,
        routeIndex: 3,
      },
      {
        id: 'lights-tool',
        label: 'Tool and entity work',
        detail: 'ControlLightsAsync resolves office lights and issues the Home Assistant service call.',
        durationMs: 189.9,
        routeIndex: 4,
      },
      {
        id: 'lights-response',
        label: 'Response synthesis',
        detail: 'Tool-summary response is composed and returned to Home Assistant.',
        durationMs: 400.8,
        routeIndex: 5,
      },
    ],
  },
  {
    id: 'trace-music',
    title: 'Trace replay: Office music',
    prompt: 'Play some music in the office.',
    result: 'Shuffling some music in the office!',
    route: [
      'Home Assistant',
      'Conversation API',
      'Lucia Router',
      'music-agent',
      'Music playback tools',
      'Response',
    ],
    traceSource: 'trace-2.json',
    selectedAgentId: 'music-agent',
    confidence: 0.94,
    totalDurationMs: 4674.8603,
    steps: [
      {
        id: 'music-ingress',
        label: 'Ingress + routing handoff',
        detail: 'Conversation API forwards the request into Lucia orchestration.',
        durationMs: 5,
        routeIndex: 1,
      },
      {
        id: 'music-route',
        label: 'Cached router decision',
        detail:
          'Prompt-cache exact match returns a cached route to music-agent, avoiding full routing inference.',
        durationMs: 3.5,
        routeIndex: 2,
      },
      {
        id: 'music-plan',
        label: 'Agent planning round',
        detail: 'music-agent runs planning (planning ChatCache round) before tool execution.',
        durationMs: 1044.3,
        routeIndex: 3,
      },
      {
        id: 'music-tool',
        label: 'Player/tool resolution',
        detail: 'MusicPlaybackSkill resolves the Office player and executes playback actions.',
        durationMs: 0.05,
        routeIndex: 4,
      },
      {
        id: 'music-playback-gap',
        label: 'Home Assistant playback startup',
        detail:
          'Home Assistant and Music Assistant generate/select a playlist and start playback before final assistant synthesis.',
        durationMs: 3287,
        routeIndex: 4,
      },
      {
        id: 'music-response',
        label: 'Response synthesis',
        detail: 'Final tool-summary response is generated and streamed back through Home Assistant.',
        durationMs: 330.4,
        routeIndex: 5,
      },
    ],
  },
];

function ConversationHero() {
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroBadgeRow}>
          <span className={styles.heroBadge}>Open Source</span>
          <span className={styles.heroBadge}>Local-first</span>
          <span className={styles.heroBadge}>Multi-agent</span>
        </div>
        <div className={styles.heroGrid}>
          <div className={styles.heroLead}>
            <Heading as="h1" className={styles.heroTitle}>
              The brain of your home.
              <span className={styles.heroTitleMuted}>Not someone else&apos;s cloud.</span>
            </Heading>
            <p className={styles.heroSubtitle}>
              Lucia is a privacy-first, multi-agent voice assistant integration for Home
              Assistant. Powerful like the big platforms, more customizable, and designed to keep
              your data in your hands.
            </p>
            <div className={clsx(styles.buttons, styles.heroButtons)}>
              <Link className="button button--primary button--lg" to="/docs/getting-started/quickstart">
                Install Lucia
              </Link>
              <Link className="button button--outline button--lg" to="/docs/getting-started/introduction">
                Read the docs
              </Link>
            </div>
            <div className={styles.heroTrustRow}>
              <div className={styles.heroTrustItem}>
                <Container className={styles.heroTrustIcon} aria-hidden />
                <span>Containerized deployment</span>
              </div>
              <div className={styles.heroTrustItem}>
                <Cpu className={styles.heroTrustIcon} aria-hidden />
                <span>Runs where you choose</span>
              </div>
              <div className={styles.heroTrustItem}>
                <Bot className={styles.heroTrustIcon} aria-hidden />
                <span>Dynamic agents</span>
              </div>
            </div>
          </div>
          <HeroArchitectureViz />
        </div>
      </div>
    </header>
  );
}

type HeroGraphKind = 'system' | 'agent' | 'tool';
type HeroGraphIcon =
  | 'ha'
  | 'lucia'
  | 'music'
  | 'lights'
  | 'climate'
  | 'shuffle'
  | 'play'
  | 'control'
  | 'set-temp'
  | 'change-hvac'
  | 'query-sensors';

type HeroGraphNodeData = {
  label: string;
  sub?: string;
  kind: HeroGraphKind;
  icon: HeroGraphIcon;
  inbound: boolean;
  outbound: boolean;
};

function renderHeroNodeIcon(icon: HeroGraphIcon): ReactNode {
  const iconMap: Record<HeroGraphIcon, ReactNode> = {
    ha: (
      <span className={styles.flowNodeLogoWrap}>
        <HomeAssistantLogo />
      </span>
    ),
    lucia: <img src="/img/lucia.png" alt="" aria-hidden className={styles.flowNodeLogoImage} />,
    music: '🎵',
    lights: '💡',
    climate: '🌡️',
    shuffle: '🔀',
    play: '▶️',
    control: '🎚️',
    'set-temp': '🌡️',
    'change-hvac': '♨️',
    'query-sensors': '📊',
  };

  return iconMap[icon];
}

function renderHeroNodeLabel(node: HeroGraphNodeData): ReactNode {
  return (
    <div
      className={clsx(
        styles.flowNode,
        node.kind === 'system' && styles.flowNodeSystem,
        node.kind === 'agent' && styles.flowNodeAgent,
        node.kind === 'tool' && styles.flowNodeTool,
      )}>
      <span className={styles.flowNodeIcon}>{renderHeroNodeIcon(node.icon)}</span>
      <div className={styles.flowNodeText}>
        <div className={styles.flowNodeLabel}>{node.label}</div>
        {node.sub ? <div className={styles.flowNodeSub}>{node.sub}</div> : null}
      </div>
    </div>
  );
}

function buildHeroFlowGraph(): {nodes: Node[]; edges: Edge[]} {
  const baseNodes: Array<{
    id: string;
    data: HeroGraphNodeData;
    width: number;
    height: number;
  }> = [
    {
      id: 'api',
      width: 176,
      height: 74,
      data: {
        label: 'HA Conversation API',
        sub: 'custom component',
        kind: 'system',
        icon: 'ha',
        inbound: false,
        outbound: true,
      },
    },
    {
      id: 'orch',
      width: 184,
      height: 74,
      data: {
        label: 'Lucia Orchestrator',
        sub: 'router/dispatch/aggregate',
        kind: 'system',
        icon: 'lucia',
        inbound: true,
        outbound: true,
      },
    },
    {
      id: 'music',
      width: 140,
      height: 66,
      data: {label: 'MusicAgent', sub: 'in-process', kind: 'agent', icon: 'music', inbound: true, outbound: true},
    },
    {
      id: 'lights',
      width: 140,
      height: 66,
      data: {label: 'LightAgent', sub: 'in-process', kind: 'agent', icon: 'lights', inbound: true, outbound: true},
    },
    {
      id: 'climate',
      width: 140,
      height: 66,
      data: {label: 'ClimateAgent', sub: 'in-process', kind: 'agent', icon: 'climate', inbound: true, outbound: true},
    },
    {
      id: 'shuffle',
      width: 122,
      height: 58,
      data: {label: 'ShufflePlay', kind: 'tool', icon: 'shuffle', inbound: true, outbound: false},
    },
    {
      id: 'play',
      width: 122,
      height: 58,
      data: {label: 'PlayMedia', kind: 'tool', icon: 'play', inbound: true, outbound: false},
    },
    {
      id: 'control',
      width: 122,
      height: 58,
      data: {label: 'ControlLights', kind: 'tool', icon: 'control', inbound: true, outbound: false},
    },
    {
      id: 'set-temp',
      width: 128,
      height: 58,
      data: {label: 'SetTemp', kind: 'tool', icon: 'set-temp', inbound: true, outbound: false},
    },
    {
      id: 'change-hvac',
      width: 128,
      height: 58,
      data: {label: 'SetHVACMode', kind: 'tool', icon: 'change-hvac', inbound: true, outbound: false},
    },
    {
      id: 'query-sensors',
      width: 128,
      height: 58,
      data: {label: 'Query Sensors', kind: 'tool', icon: 'query-sensors', inbound: true, outbound: false},
    },
  ];

  const baseEdges: Edge[] = [
    {id: 'e-api-orch', source: 'api', target: 'orch'},
    {id: 'e-orch-music', source: 'orch', target: 'music'},
    {id: 'e-orch-lights', source: 'orch', target: 'lights'},
    {id: 'e-orch-climate', source: 'orch', target: 'climate'},
    {id: 'e-music-shuffle', source: 'music', target: 'shuffle'},
    {id: 'e-music-play', source: 'music', target: 'play'},
    {id: 'e-lights-control', source: 'lights', target: 'control'},
    {id: 'e-climate-set-temp', source: 'climate', target: 'set-temp'},
    {id: 'e-climate-change-hvac', source: 'climate', target: 'change-hvac'},
    {id: 'e-climate-query-sensors', source: 'climate', target: 'query-sensors'},
  ];

  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({
    rankdir: 'LR',
    ranksep: 106,
    nodesep: 84,
    marginx: 16,
    marginy: 20,
  });

  baseNodes.forEach((node) => {
    graph.setNode(node.id, {width: node.width, height: node.height});
  });
  baseEdges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target);
  });

  dagre.layout(graph);

  const placed = baseNodes.map((node) => {
    const positioned = graph.node(node.id);
    return {
      ...node,
      rawX: positioned.x - node.width / 2,
      rawY: positioned.y - node.height / 2,
    };
  });

  const minX = Math.min(...placed.map((node) => node.rawX));
  const minY = Math.min(...placed.map((node) => node.rawY));
  const scaleX = 0.88;
  const scaleY = 1.08;

  const nodes: Node[] = placed.map((node) => {
    return {
      id: node.id,
      position: {
        x: (node.rawX - minX) * scaleX + 14,
        y: (node.rawY - minY) * scaleY + 18,
      },
      data: {label: renderHeroNodeLabel(node.data)},
      sourcePosition: node.data.outbound ? Position.Right : undefined,
      targetPosition: node.data.inbound ? Position.Left : undefined,
      draggable: false,
      selectable: false,
      className: clsx(
        styles.flowNodeShell,
        node.data.kind === 'system' && styles.flowNodeShellSystem,
        node.data.kind === 'agent' && styles.flowNodeShellAgent,
        node.data.kind === 'tool' && styles.flowNodeShellTool,
      ),
    };
  });

  const edges: Edge[] = baseEdges.map((edge) => ({
    ...edge,
    animated: false,
    type: 'smoothstep',
    style: {stroke: 'var(--hero-flow-color)', strokeWidth: 1.5},
  }));

  return {nodes, edges};
}

function HeroDataflowGraph() {
  const {nodes, edges} = useMemo(() => buildHeroFlowGraph(), []);
  const [activeEdge, setActiveEdge] = useState<{
    id: string;
    direction: 'forward' | 'reverse';
  } | null>(null);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [graphReady, setGraphReady] = useState(false);
  const flowRef = useRef<ReactFlowInstance | null>(null);

  const renderedNodes = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        className: clsx(node.className, node.id === activeNodeId && styles.flowNodeShellActive),
      })),
    [activeNodeId, nodes],
  );

  const renderedEdges = useMemo(
    () =>
      edges.map((edge) => ({
        ...edge,
        animated: edge.id === activeEdge?.id,
        markerStart:
          edge.id === activeEdge?.id && activeEdge.direction === 'reverse'
            ? {type: MarkerType.ArrowClosed, color: 'var(--hero-flow-return)'}
            : undefined,
        markerEnd:
          edge.id === activeEdge?.id && activeEdge.direction === 'forward'
            ? {type: MarkerType.ArrowClosed, color: 'var(--hero-flow-active)'}
            : undefined,
        style: {
          stroke:
            edge.id === activeEdge?.id
              ? activeEdge.direction === 'reverse'
                ? 'var(--hero-flow-return)'
                : 'var(--hero-flow-active)'
              : 'var(--hero-flow-color)',
          strokeWidth: edge.id === activeEdge?.id ? 2.2 : 1.35,
          opacity: edge.id === activeEdge?.id ? 1 : 0.52,
        },
      })),
    [activeEdge, edges],
  );

  useEffect(() => {
    if (!graphReady || !flowRef.current) {
      return;
    }

    let cancelled = false;
    const route = [
      {nodeId: 'api', edgeId: null, direction: 'forward'},
      {nodeId: 'orch', edgeId: 'e-api-orch', direction: 'forward'},
      {nodeId: 'climate', edgeId: 'e-orch-climate', direction: 'forward'},
      {nodeId: 'set-temp', edgeId: 'e-climate-set-temp', direction: 'forward'},
      {nodeId: 'climate', edgeId: 'e-climate-set-temp', direction: 'reverse'},
      {nodeId: 'orch', edgeId: 'e-orch-climate', direction: 'reverse'},
      {nodeId: 'api', edgeId: 'e-api-orch', direction: 'reverse'},
    ] as const;

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    const runTour = async () => {
      const flow = flowRef.current;
      if (!flow) {
        return;
      }

      await flow.fitView({padding: 0.18, maxZoom: 1.02, duration: 800});
      await sleep(300);

      while (!cancelled) {
        for (const step of route) {
          if (cancelled) {
            return;
          }

          setActiveNodeId(step.nodeId);
          setActiveEdge(step.edgeId ? {id: step.edgeId, direction: step.direction} : null);
          const node = flow.getNode(step.nodeId);
          if (node) {
            const x = node.position.x + (node.width ?? 120) / 2;
            const y = node.position.y + (node.height ?? 58) / 2;
            await flow.setCenter(x, y, {zoom: 1.24, duration: 1320});
          }
          await sleep(820);
        }

        setActiveEdge(null);
        setActiveNodeId(null);
        await flow.fitView({padding: 0.16, maxZoom: 1.02, duration: 920});
        await sleep(550);
      }
    };

    runTour();

    return () => {
      cancelled = true;
    };
  }, [graphReady]);

  return (
    <ReactFlow
      nodes={renderedNodes}
      edges={renderedEdges}
      fitView
      fitViewOptions={{padding: 0.14, minZoom: 0.82, maxZoom: 1.08}}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      panOnDrag={false}
      zoomOnScroll={false}
      zoomOnDoubleClick={false}
      zoomOnPinch={false}
      preventScrolling={false}
      onInit={(instance) => {
        flowRef.current = instance;
        setGraphReady(true);
      }}
      proOptions={{hideAttribution: true}}>
      <Background color="var(--hero-grid-color)" gap={18} size={1} />
    </ReactFlow>
  );
}

function HeroArchitectureViz() {
  return (
    <div className={styles.heroGraphPanel}>
      <img src="/img/lucia.png" alt="" aria-hidden className={styles.heroGraphBackdrop} />
      <div className={styles.heroFlowCanvas}>
        <BrowserOnly fallback={<div className={styles.heroFlowFallback}>Loading architecture graph…</div>}>
          {() => <HeroDataflowGraph />}
        </BrowserOnly>
      </div>
    </div>
  );
}

function HowItWorksSection() {
  return (
    <section className={clsx('section section--alt', styles.howSection)}>
      <div className="container">
        <div className="text--center margin-bottom--lg">
          <div className={styles.sectionSparkle}>
            <span className="sparkle">✦</span>
          </div>
          <Heading as="h2" className="gradient-text">
            Lucia in motion
          </Heading>
          <p>Not one giant prompt. A coordinated system of focused agents.</p>
        </div>
        <div className={styles.howGrid}>
          <div className={styles.flowCard}>
            <Heading as="h3">Request lifecycle</Heading>
            <div className={styles.flowSteps}>
              {orchestrationSteps.map((step, idx) => (
                <div key={step.title} className={styles.flowStep}>
                  <div className={styles.flowStepIndex}>{idx + 1}</div>
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.agentCardGrid}>
            {agentCards.map((agent) => (
              <div key={agent.name} className={styles.agentCard}>
                <strong>{agent.name}</strong>
                <p>{agent.focus}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="text--center margin-top--lg">
          <Link className="button button--primary" to="/docs/architecture/multi-agent">
            Explore Multi-Agent Architecture
          </Link>
        </div>
      </div>
    </section>
  );
}

function DashboardSection() {
  const [activeShotIndex, setActiveShotIndex] = useState(0);
  const heroShot = dashboardScreenshots[activeShotIndex];

  return (
    <section className={clsx('section', styles.dashboard)}>
      <div className="container">
        <div className="text--center margin-bottom--lg">
          <div className={styles.sectionSparkle}>
            <span className="sparkle">✦</span>
          </div>
          <Heading as="h2" className="gradient-text">
            Operational visibility built in
          </Heading>
          <p>Inspect traces, tune providers, manage agents, and debug decisions without guesswork.</p>
        </div>
          <div className={styles.dashboardShowcase}>
            <div className={styles.browserFrame}>
              <div className={styles.browserBar}>
                <div className={styles.browserMeta}>
                  <PlugZap className={styles.browserAppIcon} aria-hidden />
                  <span className={styles.browserTitle}>Lucia Dashboard</span>
                </div>
                <div className={styles.browserAddress}>
                  <Shield className={styles.browserAddressIcon} aria-hidden />
                  <span className={styles.browserAddressText}>lucia.local/dashboard</span>
                </div>
                <div className={styles.browserWindowControls} aria-hidden>
                  <span className={styles.browserControl}>
                    <Minus />
                  </span>
                  <span className={styles.browserControl}>
                    <Square />
                  </span>
                  <span className={clsx(styles.browserControl, styles.browserControlClose)}>
                    <X />
                  </span>
                </div>
              </div>
              <img src={heroShot.src} alt={heroShot.alt} />
            </div>
          <div className={styles.dashboardThumbs}>
            {dashboardScreenshots.map((shot, index) => (
              <button
                key={shot.alt}
                type="button"
                className={clsx(styles.dashboardThumb, index === activeShotIndex && styles.dashboardThumbActive)}
                onClick={() => setActiveShotIndex(index)}
                aria-pressed={index === activeShotIndex}>
                <img src={shot.src} alt={shot.alt} loading="lazy" />
                <div className={styles.dashboardThumbCaption}>{shot.caption}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureSection() {
  return (
    <section className={clsx('section section--alt', styles.features)}>
      <div className="container">
        <div className="text--center margin-bottom--lg">
          <div className={styles.sectionSparkle}>
            <span className="sparkle">✦</span>
          </div>
          <Heading as="h2" className="gradient-text">
            Why Lucia feels different
          </Heading>
          <p>Built for power users, but friendly enough for daily life.</p>
        </div>
        <div className="row">
          {features.map((feature) => (
            <div key={feature.title} className="col col--4 margin-bottom--lg">
              <div className="feature-card">
                <div className={styles.featureIcon}>{feature.icon}</div>
                <Heading as="h3">{feature.title}</Heading>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DemoRoutesSection() {
  const [selectedScenarioId, setSelectedScenarioId] = useState(scenarioData[0].id);
  const [typedPrompt, setTypedPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [typedResponse, setTypedResponse] = useState('');
  const [isResponseTyping, setIsResponseTyping] = useState(false);
  const [lightOn, setLightOn] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const selected = scenarioData.find((scenario) => scenario.id === selectedScenarioId) ?? scenarioData[0];

  useEffect(() => {
    let promptIndex = 0;
    let finishTimeout: ReturnType<typeof setTimeout> | undefined;
    setIsTyping(true);
    setTypedPrompt('');

    const interval = setInterval(() => {
      promptIndex += 1;
      setTypedPrompt(selected.prompt.slice(0, promptIndex));
      if (promptIndex >= selected.prompt.length) {
        clearInterval(interval);
        finishTimeout = setTimeout(() => setIsTyping(false), 180);
      }
    }, 16);

    return () => {
      clearInterval(interval);
      if (finishTimeout) {
        clearTimeout(finishTimeout);
      }
    };
  }, [selected]);

  useEffect(() => {
    if (isTyping) {
      setActiveStepIndex(0);
      setTypedResponse('');
      setIsResponseTyping(false);
      setLightOn(false);
      setMusicPlaying(false);
      return;
    }

    let cancelled = false;
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const runReplay = async () => {
      for (let index = 0; index < selected.steps.length; index += 1) {
        if (cancelled) {
          return;
        }
        const step = selected.steps[index];
        setActiveStepIndex(index);

        if (step.id.endsWith('-tool')) {
          if (selected.id === 'trace-lights') {
            setLightOn(true);
          }
          if (selected.id === 'trace-music') {
            setMusicPlaying(true);
          }
        }

        const replayDelay = Math.max(0, Math.round(step.durationMs));
        await sleep(replayDelay);

        if (step.id.endsWith('-response')) {
          setIsResponseTyping(true);
          for (let cursor = 1; cursor <= selected.result.length; cursor += 1) {
            if (cancelled) {
              return;
            }
            setTypedResponse(selected.result.slice(0, cursor));
            await sleep(14);
          }
          setIsResponseTyping(false);
        }
      }
    };

    runReplay();

    return () => {
      cancelled = true;
    };
  }, [isTyping, selected]);

  const activeStep = selected.steps[activeStepIndex] ?? selected.steps[0];
  const isLightScenario = selected.id === 'trace-lights';
  const responseReady = typedResponse.length > 0;

  return (
    <section className={clsx('section', styles.demoSection)}>
      <div className="container">
        <div className="text--center margin-bottom--lg">
          <div className={styles.sectionSparkle}>
            <span className="sparkle">✦</span>
          </div>
          <Heading as="h2" className="gradient-text">
            Pick a scenario, inspect the route
          </Heading>
          <p>Same assistant experience, but with transparent routing behind the scenes.</p>
          <p className={styles.demoTraceNote}>
            Trace captures for this demo are from my homelab using gpt-oss-120b on Azure OpenAI,
            with prompt caching enabled to dramatically reduce latency.
          </p>
        </div>
        <div className={styles.demoGrid}>
          <div className={styles.demoScenarioList}>
            {scenarioData.map((scenario) => (
              <button
                key={scenario.id}
                type="button"
                onClick={() => setSelectedScenarioId(scenario.id)}
                className={clsx(styles.demoScenarioButton, scenario.id === selected.id && styles.demoScenarioButtonActive)}>
                <div className={styles.demoScenarioHead}>
                  <strong className={styles.demoScenarioTitle}>{scenario.title}</strong>
                  <span className={styles.demoScenarioDuration}>{formatDurationMs(scenario.totalDurationMs)}</span>
                </div>
                <span className={styles.demoScenarioPrompt}>{scenario.prompt}</span>
                <div className={styles.demoScenarioMeta}>
                  {scenario.selectedAgentId} • {scenario.traceSource}
                </div>
              </button>
            ))}
          </div>
          <div className={styles.demoConsole}>
            <div className={styles.demoConsoleHeader}>lucia://assistant</div>
            <div className={styles.demoMetrics}>
              <span className={styles.demoMetric}>
                agent: <strong>{selected.selectedAgentId}</strong>
              </span>
              <span className={styles.demoMetric}>
                confidence: <strong>{Math.round(selected.confidence * 100)}%</strong>
              </span>
              <span className={styles.demoMetric}>
                total: <strong>{formatDurationMs(selected.totalDurationMs)}</strong>
              </span>
              <span className={styles.demoMetric}>
                trace: <strong>{selected.traceSource}</strong>
              </span>
            </div>
            <div className={styles.demoOutcomePanel}>
              {isLightScenario ? (
                <div className={clsx(styles.demoOutcomeDevice, styles.demoOutcomeLight, lightOn && styles.demoOutcomeDeviceActive)}>
                  <Lightbulb className={styles.demoOutcomeIcon} />
                  <div className={styles.demoOutcomeText}>
                    <strong>{lightOn ? 'Office lights are on' : 'Office lights are idle'}</strong>
                    <span>Switches on when ControlLightsAsync runs in the trace.</span>
                  </div>
                </div>
              ) : (
                <div
                  className={clsx(
                    styles.demoOutcomeDevice,
                    styles.demoOutcomeMusic,
                    musicPlaying && styles.demoOutcomeDeviceActive,
                  )}>
                  <div className={styles.demoSpeakerWrap}>
                    <Speaker className={styles.demoOutcomeIcon} />
                    <Music2 className={clsx(styles.demoMusicBurst, styles.demoMusicBurstOne, musicPlaying && styles.demoMusicBurstActive)} />
                    <Music2 className={clsx(styles.demoMusicBurst, styles.demoMusicBurstTwo, musicPlaying && styles.demoMusicBurstActive)} />
                  </div>
                  <div className={styles.demoOutcomeText}>
                    <strong>{musicPlaying ? 'Office playback is active' : 'Office speaker is idle'}</strong>
                    <span>Music notes animate when playback tooling starts in the trace.</span>
                  </div>
                </div>
              )}
            </div>
            <div className={styles.demoConsolePrompt}>
              <span>&gt; </span>
              {typedPrompt}
              {isTyping ? <span className={styles.demoCursor}>▌</span> : null}
            </div>
            <div className={clsx(styles.demoConsoleResponse, !responseReady && styles.demoResponsePending)}>
              <span>✓ </span>
              {responseReady ? typedResponse : 'waiting for response synthesis...'}
              {isResponseTyping ? <span className={styles.demoCursor}>▌</span> : null}
            </div>
            <div className={styles.demoRouteLabel}>Route replay</div>
            <div className={styles.demoRouteChips}>
              {selected.route.map((step, index) => (
                <span
                  key={`${step}-${index}`}
                  className={clsx(
                    styles.demoRouteChip,
                    index < activeStep.routeIndex && styles.demoRouteChipDone,
                    index === activeStep.routeIndex && styles.demoRouteChipActive,
                  )}>
                  {step}
                </span>
              ))}
            </div>
            <div className={styles.demoTimelineLabel}>Execution timeline</div>
            <div className={styles.demoTimeline}>
              {selected.steps.map((step, index) => (
                <div
                  key={step.id}
                  className={clsx(
                    styles.demoTimelineStep,
                    index < activeStepIndex && styles.demoTimelineStepDone,
                    index === activeStepIndex && styles.demoTimelineStepActive,
                  )}>
                  <div className={styles.demoTimelineStepHead}>
                    <strong>{step.label}</strong>
                    <span>{formatDurationMs(step.durationMs)}</span>
                  </div>
                  <p>{step.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArchitectureSection() {
  const inProcessAgents = [
    {
      name: 'LightAgent',
      description: 'Ambience control',
      skills: ['Toggle', 'Brightness', 'Color'],
      icon: <Lightbulb className={styles.archAgentIconSvg} aria-hidden />,
      toneClass: styles.archAgentToneLight,
    },
    {
      name: 'ClimateAgent',
      description: 'Comfort tuning',
      skills: ['Temperature', 'Mode', 'Fan'],
      icon: <Thermometer className={styles.archAgentIconSvg} aria-hidden />,
      toneClass: styles.archAgentToneClimate,
    },
    {
      name: 'SceneAgent',
      description: 'Routine triggers',
      skills: ['Activate', 'Create', 'List'],
      icon: <Sparkles className={styles.archAgentIconSvg} aria-hidden />,
      toneClass: styles.archAgentToneScene,
    },
    {
      name: 'ListsAgent',
      description: 'Task memory',
      skills: ['Add', 'Remove', 'Read'],
      icon: <ListTodo className={styles.archAgentIconSvg} aria-hidden />,
      toneClass: styles.archAgentToneLists,
    },
    {
      name: 'GeneralAgent',
      description: 'Fallback brain',
      skills: ['Chat', 'Q&A', 'Fallback'],
      icon: <MessageCircle className={styles.archAgentIconSvg} aria-hidden />,
      toneClass: styles.archAgentToneGeneral,
    },
    {
      name: 'MusicAgent',
      description: 'Playback control',
      skills: ['Play', 'Queue', 'Volume'],
      icon: <Music2 className={styles.archAgentIconSvg} aria-hidden />,
      toneClass: styles.archAgentToneMusic,
    },
    {
      name: 'TimerAgent',
      description: 'Scheduled reminders',
      skills: ['Timers', 'Alarms', 'Announce'],
      icon: <AlarmClock className={styles.archAgentIconSvg} aria-hidden />,
      toneClass: styles.archAgentToneTimer,
    },
    {
      name: 'DynamicAgent (0..N)',
      description: 'Custom specialists',
      skills: ['Plugins', 'Tools', 'Domain logic'],
      icon: <Bot className={styles.archAgentIconSvg} aria-hidden />,
      toneClass: styles.archAgentToneCustom,
    },
  ];

  return (
    <section className={clsx('section', styles.architecture)}>
      <div className="container">
        <div className="text--center margin-bottom--lg">
          <div className={styles.sectionSparkle}>
            <span className="sparkle">✦</span>
          </div>
          <Heading as="h2" className="gradient-text">
            Multi-Agent Architecture
          </Heading>
          <p>
            Lucia uses the A2A (Agent-to-Agent) protocol with JSON-RPC for communication between
            components and optional satellite hosts.
          </p>
          <p className={styles.archModeNote}>
            Default standalone deployment keeps all agents in-process. Mesh mode can move selected
            agents to A2AHost services without changing routing behavior.
          </p>
        </div>
        <div className={styles.archDiagram}>
          <div className={clsx(styles.archNode, styles.archNodeHa)}>
            <span className={styles.archNodeIcon}>
              <HomeAssistantLogo />
            </span>
            <span className={styles.archNodeLabel}>Home Assistant</span>
          </div>
          <div className={styles.archConnector}>
            <div className={styles.archLine} />
            <span className={styles.archConnectorLabel}>JSON-RPC</span>
          </div>
          <div className={styles.archBox}>
            <div className={styles.archBoxHeader}>AgentHost</div>
            <div className={styles.archPipeline}>
              <div className={clsx(styles.archPipelineStep, styles.archStepRouter)}>
                <span className={styles.archStepIcon}>🔀</span>
                <strong>Router</strong>
                <small>Semantic matching</small>
              </div>
              <div className={styles.archArrow} />
              <div className={clsx(styles.archPipelineStep, styles.archStepDispatch)}>
                <span className={styles.archStepIcon}>📡</span>
                <strong>Dispatcher</strong>
                <small>Agent routing</small>
              </div>
              <div className={styles.archArrow} />
              <div className={clsx(styles.archPipelineStep, styles.archStepAggregator)}>
                <span className={styles.archStepIcon}>📋</span>
                <strong>Aggregator</strong>
                <small>Response formatting</small>
              </div>
            </div>
            <div className={styles.archSectionLabel}>In-process Agents (default)</div>
            <div className={styles.archAgentGrid}>
              {inProcessAgents.map((agent) => (
                <div key={agent.name} className={clsx(styles.archAgentCard, agent.toneClass)}>
                  <div className={styles.archAgentHeader}>
                    <span className={styles.archAgentIconWrap}>{agent.icon}</span>
                    <div>
                      <strong className={styles.archAgentName}>{agent.name}</strong>
                      <small className={styles.archAgentDesc}>{agent.description}</small>
                    </div>
                  </div>
                  <div className={styles.archSkillRow}>
                    {agent.skills.map((skill) => (
                      <span key={skill} className={styles.archSkill}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.archSectionLabel}>A2A Support (optional mesh mode)</div>
            <div className={styles.archDynamicRow}>
              <div className={clsx(styles.archAgentCard, styles.archAgentDynamic, styles.archAgentToneA2A)}>
                <div className={styles.archAgentHeader}>
                  <span className={styles.archAgentIconWrap}>
                    <PlugZap className={styles.archAgentIconSvg} aria-hidden />
                  </span>
                  <div>
                    <strong className={styles.archAgentName}>Any Agent via A2AHost</strong>
                    <small className={styles.archAgentDesc}>Move selected agents out-of-process when needed</small>
                  </div>
                </div>
                <div className={styles.archSkillRow}>
                  <span className={styles.archSkill}>JSON-RPC</span>
                  <span className={styles.archSkill}>agent cards</span>
                  <span className={styles.archSkill}>optional remote</span>
                </div>
              </div>
              <div className={clsx(styles.archAgentCard, styles.archAgentDynamic, styles.archAgentToneExternal)}>
                <div className={styles.archAgentHeader}>
                  <span className={styles.archAgentIconWrap}>
                    <Sparkles className={styles.archAgentIconSvg} aria-hidden />
                  </span>
                  <div>
                    <strong className={styles.archAgentName}>External Specialist Agent</strong>
                    <small className={styles.archAgentDesc}>Bring Python/TS/.NET services into Lucia routing</small>
                  </div>
                </div>
                <div className={styles.archSkillRow}>
                  <span className={styles.archSkill}>A2A</span>
                  <span className={styles.archSkill}>language agnostic</span>
                  <span className={styles.archSkill}>A2A card</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text--center margin-top--lg">
          <Link className="button button--primary" to="/docs/architecture/overview">
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section className={clsx('section section--alt', styles.trustSection)}>
      <div className="container">
        <div className="text--center margin-bottom--lg">
          <div className={styles.sectionSparkle}>
            <span className="sparkle">✦</span>
          </div>
          <Heading as="h2" className="gradient-text">
            Privacy and deployment choice
          </Heading>
          <p>Your home, your data, your provider decisions.</p>
        </div>
        <div className={styles.trustGrid}>
          <div className={styles.trustPrivacy}>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>🏠</span>
              <div>
                <strong>Local-first operation</strong>
                <p>Run on your infrastructure and keep telemetry boundaries under your control.</p>
              </div>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>🔒</span>
              <div>
                <strong>Transparent architecture</strong>
                <p>Inspect routing, traces, and behavior directly from the dashboard and logs.</p>
              </div>
            </div>
            <div className={styles.trustItem}>
              <span className={styles.trustIcon}>☁️</span>
              <div>
                <strong>Cloud optional</strong>
                <p>Use OpenAI, Anthropic, Gemini, Azure, OpenRouter, or stay local with Ollama.</p>
              </div>
            </div>
          </div>
          <div>
            <div className={styles.trustProvidersLabel}>Supported Providers</div>
            <div className={styles.providerGrid}>
              {providers.map((provider) => (
                <div key={provider.name} className={styles.providerCard}>
                  <div className={styles.providerLogo} style={{color: provider.color}}>
                    {provider.logo}
                  </div>
                  <span className={styles.providerName}>{provider.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuickStartSection() {
  return (
    <section className={clsx('section', styles.quickstart)}>
      <div className="container">
        <div className="text--center margin-bottom--lg">
          <Heading as="h2" className="gradient-text">
            Get running in minutes
          </Heading>
        </div>
        <div className="row">
          <div className="col col--4">
            <div className="feature-card text--center">
              <span className="step-number">1</span>
              <Heading as="h3">Docker Compose</Heading>
              <p>
                Start Redis, MongoDB, and Lucia AgentHost using{' '}
                <code>docker compose up -d</code>.
              </p>
            </div>
          </div>
          <div className="col col--4">
            <div className="feature-card text--center">
              <span className="step-number">2</span>
              <Heading as="h3">Setup Wizard</Heading>
              <p>
                Open Lucia and configure provider, Home Assistant connection, and enabled agents.
              </p>
            </div>
          </div>
          <div className="col col--4">
            <div className="feature-card text--center">
              <span className="step-number">3</span>
              <Heading as="h3">Start Talking</Heading>
              <p>Install the HA integration and begin natural-language control across your home.</p>
            </div>
          </div>
        </div>
        <div className="text--center margin-top--lg">
          <Link className="button button--primary button--lg" to="/docs/getting-started/quickstart">
            Full Quickstart Guide
          </Link>
        </div>
      </div>
    </section>
  );
}

type ComparisonValue = 'yes' | 'partial' | 'no';
type ComparisonCell =
  | {kind: 'indicator'; value: ComparisonValue; detail?: string; asterisk?: boolean}
  | {kind: 'metric'; value: string; detail?: string};

const localHardwareQualifier =
  'Depends on sufficient local hardware and model/runtime setup for fully local execution.';

const comparisonData: Array<{
  feature: string;
  lucia: ComparisonCell;
  google: ComparisonCell;
  alexa: ComparisonCell;
  apple: ComparisonCell;
}> = [
  {
    feature: 'Runs locally',
    lucia: {kind: 'indicator', value: 'yes', asterisk: true, detail: localHardwareQualifier},
    google: {kind: 'indicator', value: 'no'},
    alexa: {kind: 'indicator', value: 'no'},
    apple: {
      kind: 'indicator',
      value: 'partial',
      detail: 'Some local automation execution exists, but many Siri requests still depend on cloud processing.',
    },
  },
  {
    feature: 'Open source',
    lucia: {kind: 'indicator', value: 'yes'},
    google: {kind: 'indicator', value: 'no'},
    alexa: {kind: 'indicator', value: 'no'},
    apple: {kind: 'indicator', value: 'no'},
  },
  {
    feature: 'Choose your LLM',
    lucia: {kind: 'indicator', value: 'yes'},
    google: {kind: 'indicator', value: 'no'},
    alexa: {kind: 'indicator', value: 'no'},
    apple: {kind: 'indicator', value: 'no'},
  },
  {
    feature: 'Multi-agent routing',
    lucia: {kind: 'indicator', value: 'yes'},
    google: {kind: 'indicator', value: 'no'},
    alexa: {kind: 'indicator', value: 'no'},
    apple: {kind: 'indicator', value: 'no'},
  },
  {
    feature: 'Custom agents',
    lucia: {kind: 'indicator', value: 'yes'},
    google: {
      kind: 'indicator',
      value: 'partial',
      detail: 'Integrations and routines exist, but no open user-defined agent runtime with orchestration semantics.',
    },
    alexa: {
      kind: 'indicator',
      value: 'partial',
      detail: 'Alexa Skills are extensible, but not an open multi-agent orchestration model.',
    },
    apple: {kind: 'indicator', value: 'no'},
  },
  {
    feature: 'Data stays home',
    lucia: {kind: 'indicator', value: 'yes', asterisk: true, detail: localHardwareQualifier},
    google: {kind: 'indicator', value: 'no'},
    alexa: {kind: 'indicator', value: 'no'},
    apple: {
      kind: 'indicator',
      value: 'partial',
      detail: 'Some on-device processing is available, but cloud services still handle part of the assistant workflow.',
    },
  },
  {
    feature: 'Transparent traces',
    lucia: {kind: 'indicator', value: 'yes'},
    google: {kind: 'indicator', value: 'no'},
    alexa: {kind: 'indicator', value: 'no'},
    apple: {kind: 'indicator', value: 'no'},
  },
  {
    feature: 'No cloud dependency',
    lucia: {kind: 'indicator', value: 'yes', asterisk: true, detail: localHardwareQualifier},
    google: {kind: 'indicator', value: 'no'},
    alexa: {kind: 'indicator', value: 'no'},
    apple: {kind: 'indicator', value: 'no'},
  },
  {
    feature: 'Average response time',
    lucia: {
      kind: 'metric',
      value: '~3-8s',
      detail: 'Typical observed range with self-hosted orchestration; depends on model, hardware, and tool latency.',
    },
    google: {kind: 'metric', value: '~1-2s'},
    alexa: {kind: 'metric', value: '~1-2s'},
    apple: {kind: 'metric', value: '~1-2s'},
  },
];

function ComparisonIndicator({
  value,
  detail,
  asterisk = false,
}: {
  value: ComparisonValue;
  detail?: string;
  asterisk?: boolean;
}) {
  const labels: Record<ComparisonValue, string> = {yes: '\u2713', partial: '~', no: '\u2715'};
  const meanings: Record<ComparisonValue, string> = {
    yes: 'Supported',
    partial: 'Partially supported',
    no: 'Not supported',
  };
  const tooltip = detail ?? meanings[value];
  const indicator = (
    <span
      aria-label={tooltip}
      className={clsx(
        styles.comparisonIndicator,
        value === 'yes' && styles.comparisonYes,
        value === 'partial' && styles.comparisonPartial,
        value === 'no' && styles.comparisonNo,
        tooltip && styles.comparisonIndicatorDetailed,
      )}>
      {labels[value]}
      {asterisk && <sup className={styles.comparisonIndicatorAsterisk}>*</sup>}
    </span>
  );
  return (
    <ComparisonTooltip content={tooltip}>
      {indicator}
    </ComparisonTooltip>
  );
}

function ComparisonTooltip({content, children}: {content?: string; children: ReactNode}) {
  if (!content) {
    return <>{children}</>;
  }
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          className={styles.comparisonTooltipContent}
          side="top"
          align="center"
          sideOffset={8}
          collisionPadding={8}>
          {content}
          <Tooltip.Arrow className={styles.comparisonTooltipArrow} />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

function ComparisonCellView({cell}: {cell: ComparisonCell}) {
  if (cell.kind === 'metric') {
    const metricChip = (
      <span
        className={clsx(styles.comparisonMetricChip, cell.detail && styles.comparisonMetricDetailed)}
        aria-label={cell.detail ?? cell.value}>
        {cell.value}
      </span>
    );
    return (
      <ComparisonTooltip content={cell.detail}>
        {metricChip}
      </ComparisonTooltip>
    );
  }
  return <ComparisonIndicator value={cell.value} detail={cell.detail} asterisk={cell.asterisk} />;
}

function ComparisonSection() {
  return (
    <Tooltip.Provider delayDuration={120}>
      <section className={clsx('section section--alt', styles.comparisonSection)}>
        <div className="container">
          <div className="text--center margin-bottom--lg">
            <div className={styles.sectionSparkle}>
              <span className="sparkle">✦</span>
            </div>
            <Heading as="h2" className="gradient-text">
              How Lucia stacks up
            </Heading>
            <p>An honest look at what you get when you opt out of the cloud.</p>
          </div>
          <div className={styles.comparisonTableWrap}>
            <table className={styles.comparisonTable}>
              <colgroup>
                <col className={styles.comparisonColFeature} />
                <col className={styles.comparisonColLucia} />
                <col className={styles.comparisonColVendor} />
                <col className={styles.comparisonColVendor} />
                <col className={styles.comparisonColVendor} />
              </colgroup>
              <thead>
                <tr>
                  <th>Capability</th>
                  <th className={styles.comparisonLuciaCell}>Lucia</th>
                  <th>Google Home</th>
                  <th>Alexa</th>
                  <th>Apple Home</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row) => (
                  <tr key={row.feature}>
                    <td className={styles.comparisonFeature}>{row.feature}</td>
                    <td className={styles.comparisonLuciaCell}>
                      <ComparisonCellView cell={row.lucia} />
                    </td>
                    <td><ComparisonCellView cell={row.google} /></td>
                    <td><ComparisonCellView cell={row.alexa} /></td>
                    <td><ComparisonCellView cell={row.apple} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.comparisonLegend} aria-label="Comparison legend">
            <span className={styles.comparisonLegendItem}>
              <ComparisonIndicator value="yes" />
              Yes
            </span>
            <span className={styles.comparisonLegendItem}>
              <ComparisonIndicator value="partial" />
              Partial / limited support
            </span>
            <span className={styles.comparisonLegendItem}>
              <ComparisonIndicator value="no" />
              Not supported
            </span>
          </div>
          <p className={styles.comparisonLegendNote}>
            Hover any <strong>~</strong> to see what partial support means for that platform. Response
            times are approximate consumer-observed ranges and vary by network, region, and workload.
            Items marked <strong>*</strong> in Lucia depend on sufficient local hardware and model setup.
          </p>
        </div>
      </section>
    </Tooltip.Provider>
  );
}

function DisappointmentMeter() {
  const {siteConfig} = useDocusaurusContext();
  const fallbackStatsUrl = useBaseUrl('/data/repo-stats.json');
  const configuredStatsUrl =
    typeof siteConfig.customFields?.statsApiUrl === 'string'
      ? siteConfig.customFields.statsApiUrl.trim()
      : '';
  const statsUrl = configuredStatsUrl.length > 0 ? configuredStatsUrl : fallbackStatsUrl;
  const [repoStats, setRepoStats] = useState<{
    stars: number;
    forks: number;
    openIssues: number;
    dockerPulls: number;
  } | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetch(statsUrl, {cache: 'no-store'})
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Unable to load stats (${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        if (
          typeof data?.stars === 'number' &&
          typeof data?.forks === 'number' &&
          typeof data?.openIssues === 'number' &&
          (typeof data?.dockerPulls === 'number' || typeof data?.dockerPulls === 'undefined') &&
          isMounted
        ) {
          setRepoStats({
            stars: data.stars,
            forks: data.forks,
            openIssues: data.openIssues,
            dockerPulls: typeof data.dockerPulls === 'number' ? data.dockerPulls : 0,
          });
          setStatsError(null);
          return;
        }
        throw new Error('Stats payload is malformed');
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Unknown stats error';
        console.warn('[DisappointmentMeter] Failed to load repo stats:', message);
        if (isMounted) {
          setStatsError(message);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [statsUrl]);

  if (repoStats === null) {
    return (
      <div className={styles.disappointmentMeter}>
        <Heading as="h3" className={styles.disappointmentTitle}>
          The “I Installed It, Forgot to Star It” Meter&trade;
        </Heading>
        <p className={styles.disappointmentQuip}>
          {statsError
            ? 'Telemetry uplink failed. The cloud overlords are probably rate-limiting us.'
            : 'Calibrating chaos metrics...'}
        </p>
      </div>
    );
  }

  const {stars, forks, openIssues, dockerPulls} = repoStats;
  const msPerDay = 24 * 60 * 60 * 1000;
  const launchDate = new Date('2026-02-20T00:00:00.000Z');
  const daysSinceLaunch = Math.max(
    1,
    Math.floor((Date.now() - launchDate.getTime()) / msPerDay),
  );

  const requestsPerStarPerDay = 55; // midpoint of 50-60
  const familySizePerStar = 3.5;
  const requestsPerDockerPull = 42;
  const peoplePerDockerPull = 1.2;
  const adsPerPersonPerDay = 2;

  const estimatedRequests = Math.round(
    stars * requestsPerStarPerDay * daysSinceLaunch + dockerPulls * requestsPerDockerPull,
  );
  const estimatedPeople = stars * familySizePerStar + dockerPulls * peoplePerDockerPull;
  const adsAverted = Math.round(estimatedPeople * adsPerPersonPerDay * daysSinceLaunch);
  const lightsToggled = Math.round(
    estimatedRequests * 0.46 + forks * 37 * daysSinceLaunch + dockerPulls * 28,
  );
  const playlistsStarted = Math.round(
    estimatedRequests * 0.19 + forks * 121 + openIssues * 13 + dockerPulls * 0.65,
  );
  const timersSet = Math.round(
    estimatedRequests * 0.11 + openIssues * 9 * daysSinceLaunch + dockerPulls * 0.38,
  );
  const boardroomPanicIndex = Math.max(
    1,
    Math.round(((lightsToggled + adsAverted + dockerPulls * 75) / Math.max(openIssues, 1)) * 0.018),
  );
  const starsToPullsRatio = (stars + 1) / (dockerPulls + 1);
  const missedStarPressure = 1 / starsToPullsRatio;
  const barPercent = Math.max(
    5,
    Math.min(100, Math.round(Math.log10(Math.max(missedStarPressure, 1)) * 55 + 15)),
  );

  const quip =
    boardroomPanicIndex < 1000
      ? 'Cloud strategists remain calm, but only externally.'
      : boardroomPanicIndex < 5000
        ? 'Somewhere, a product manager just opened a “local-first risk” spreadsheet.'
        : boardroomPanicIndex < 20000
          ? 'Quarterly planning now includes a slide titled “why are people doing this themselves?”'
          : 'Emergency memo drafted: “Please stop toggling lights without subscription tiers.”';

  return (
    <div className={styles.disappointmentMeter}>
      <Heading as="h3" className={styles.disappointmentTitle}>
        The “I Installed It, Forgot to Star It” Meter&trade;
      </Heading>
      <div className={styles.disappointmentBarTrack}>
        <div className={styles.disappointmentBarFill} style={{width: `${barPercent}%`}} />
      </div>
      <div className={styles.disappointmentStats}>
        <span>
          <strong>{stars.toLocaleString()}</strong> GitHub stars
        </span>
        <span className={styles.disappointmentVs}>vs</span>
        <span>
          <strong>{dockerPulls.toLocaleString()}</strong> Docker pulls
        </span>
      </div>
      <p className={styles.disappointmentDaysSinceLaunch}>
        <strong>{daysSinceLaunch}</strong> days since launch
      </p>
      <div className={styles.disappointmentRawStats}>
        <span><strong>{forks.toLocaleString()}</strong> repo remixes in the wild</span>
        <span><strong>{openIssues.toLocaleString()}</strong> active “what if Lucia also…” ideas</span>
      </div>
      <div className={styles.disappointmentMetricsGrid}>
        <article className={styles.disappointmentMetricCard}>
          <p className={styles.disappointmentMetricLabel}>Estimated Agent Requests</p>
          <p className={styles.disappointmentMetricValue}>{estimatedRequests.toLocaleString()}</p>
          <p className={styles.disappointmentMetricNote}>tiny household asks, now fully unionized</p>
        </article>
        <article className={styles.disappointmentMetricCard}>
          <p className={styles.disappointmentMetricLabel}>Ads Averted</p>
          <p className={styles.disappointmentMetricValue}>{adsAverted.toLocaleString()}</p>
          <p className={styles.disappointmentMetricNote}>fewer “have you tried premium?” interruptions</p>
        </article>
        <article className={styles.disappointmentMetricCard}>
          <p className={styles.disappointmentMetricLabel}>Lights Toggled</p>
          <p className={styles.disappointmentMetricValue}>{lightsToggled.toLocaleString()}</p>
          <p className={styles.disappointmentMetricNote}>calibrated by vibes, moon phases, and suspiciously busy weekends</p>
        </article>
        <article className={styles.disappointmentMetricCard}>
          <p className={styles.disappointmentMetricLabel}>Playlists Started</p>
          <p className={styles.disappointmentMetricValue}>{playlistsStarted.toLocaleString()}</p>
          <p className={styles.disappointmentMetricNote}>music-agent optimism coefficient enabled</p>
        </article>
        <article className={styles.disappointmentMetricCard}>
          <p className={styles.disappointmentMetricLabel}>Timers Set</p>
          <p className={styles.disappointmentMetricValue}>{timersSet.toLocaleString()}</p>
          <p className={styles.disappointmentMetricNote}>includes pasta, tea, and existential dread</p>
        </article>
        <article className={styles.disappointmentMetricCard}>
          <p className={styles.disappointmentMetricLabel}>Boardroom Panic Index</p>
          <p className={styles.disappointmentMetricValue}>{boardroomPanicIndex.toLocaleString()}</p>
          <p className={styles.disappointmentMetricNote}>measured in emergency strategy off-sites</p>
        </article>
      </div>
      <p className={styles.disappointmentQuip}>{quip}</p>
      <p className={styles.disappointmentDisclaimer}>
        We literally cannot know these true numbers because everything runs on your infrastructure and
        data stays yours. These are intentionally made-up estimates for fun.
      </p>
    </div>
  );
}

function CommunitySection() {
  return (
    <section className="section">
      <div className="container">
        <div className="cta-section">
          <Heading as="h2" className="gradient-text">
            Join the quiet rebellion
          </Heading>
          <p className="margin-bottom--lg">
            Lucia is MIT licensed and community-driven. Contribute docs, build plugins, improve
            routing, or ship new agents.
          </p>
          <div className={styles.buttons}>
            <Link className="button button--primary button--lg" to="https://github.com/seiggy/lucia-dotnet">
              Star on GitHub
            </Link>
            <Link className="button button--outline button--lg" to="/docs/project/contributing">
              Contributing Guide
            </Link>
          </div>
          <BrowserOnly>{() => <DisappointmentMeter />}</BrowserOnly>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Privacy-First AI Home Assistant"
      description="Lucia is an open-source, privacy-first AI assistant for Home Assistant with multi-agent orchestration, local-first operation, and an extensible plugin ecosystem.">
      <ConversationHero />
      <main>
        <HowItWorksSection />
        <DashboardSection />
        <FeatureSection />
        <DemoRoutesSection />
        <ArchitectureSection />
        <TrustSection />
        <ComparisonSection />
        <QuickStartSection />
        <CommunitySection />
      </main>
    </Layout>
  );
}
