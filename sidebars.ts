import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/introduction',
        'getting-started/quickstart',
        'getting-started/first-conversation',
        'getting-started/home-assistant-setup',
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'architecture/overview',
        'architecture/multi-agent',
        'architecture/orchestration',
        'architecture/a2a-protocol',
        'architecture/data-flow',
        'architecture/deployment-modes',
      ],
    },
    {
      type: 'category',
      label: 'Agents',
      items: [
        'agents/overview',
        'agents/light-agent',
        'agents/climate-agent',
        'agents/scene-agent',
        'agents/music-agent',
        'agents/timer-agent',
        'agents/lists-agent',
        'agents/general-agent',
        'agents/custom-agents',
      ],
    },
    {
      type: 'category',
      label: 'Dashboard',
      items: [
        'dashboard/overview',
        'dashboard/activity',
        'dashboard/traces',
        'dashboard/agents-page',
        'dashboard/agent-definitions',
        'dashboard/model-providers',
        'dashboard/mcp-servers',
        'dashboard/configuration',
        'dashboard/exports',
        'dashboard/prompt-cache',
        'dashboard/tasks',
        'dashboard/alarms',
        'dashboard/presence',
        'dashboard/plugins-page',
        'dashboard/entity-location',
        'dashboard/matcher-debug',
        'dashboard/lists-page',
        'dashboard/skill-optimizer',
      ],
    },
    {
      type: 'category',
      label: 'Plugins',
      items: [
        'plugins/overview',
        'plugins/creating-plugins',
        'plugins/lifecycle',
        'plugins/api',
        'plugins/repositories',
        'plugins/official-plugins',
      ],
    },
    {
      type: 'category',
      label: 'Home Assistant',
      items: [
        'home-assistant/overview',
        'home-assistant/installation',
        'home-assistant/configuration',
        'home-assistant/entity-management',
        'home-assistant/conversation-api',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        'reference/configuration',
        'reference/environment-variables',
        'reference/model-providers',
        'reference/connection-strings',
      ],
    },
    {
      type: 'category',
      label: 'API',
      items: [
        'api/rest-api',
        'api/a2a-protocol',
        'api/json-rpc',
        'api/dashboard-api',
      ],
    },
    {
      type: 'category',
      label: 'Deployment',
      items: [
        'deployment/overview',
        'deployment/docker-compose',
        'deployment/kubernetes',
        'deployment/helm',
        'deployment/systemd',
        'deployment/comparison',
      ],
    },
    {
      type: 'category',
      label: 'Tutorials',
      items: [
        'tutorials/custom-agent',
        'tutorials/plugin-creation',
        'tutorials/mcp-tools',
        'tutorials/multi-llm',
        'tutorials/training-export',
      ],
    },
    {
      type: 'category',
      label: 'Project',
      items: [
        'project/roadmap',
        'project/architecture-decisions',
        'project/tech-stack',
        'project/contributing',
        'project/changelog',
      ],
    },
  ],
};

export default sidebars;
