import type {ReactNode} from 'react';
import {useEffect, useRef} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {
  Activity,
  ArrowRight,
  Braces,
  CloudCog,
  GitBranch,
  Network,
  PackageOpen,
  PlugZap,
  ServerCog,
  ShieldCheck,
  TerminalSquare,
} from 'lucide-react';
import pluginsData from '@site/src/data/plugins.json';
import styles from './index.module.css';

type Plugin = {
  id: string;
  name: string;
  description: string;
  docsUrl: string;
};

const plugins = (pluginsData as Plugin[]).slice(0, 3);

type Drop = {x: number; y: number; vx: number; vy: number; depth: number; red: boolean};

// The world is a gravity garden, so the pointer is a mass rather than a
// highlight: drops fall, bend toward it, slingshot past, and recover.
function HeroField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;

    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fine = window.matchMedia('(pointer: fine)');

    let width = 0;
    let height = 0;
    let drops: Drop[] = [];
    let frame = 0;
    let previous = 0;
    let lean = 0;
    let lastScroll = window.scrollY;
    const pointer = {x: 0, y: 0, active: false};

    const between = (min: number, max: number) => min + Math.random() * (max - min);

    const spawn = (seeded: boolean): Drop => ({
      x: between(-0.08, 1.08) * width,
      y: seeded ? Math.random() * height : between(-0.3, -0.02) * height,
      vx: 0,
      vy: between(0.4, 1.8),
      depth: between(0.32, 1),
      red: Math.random() > 0.82,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.lineCap = 'round';
      const count = Math.round(Math.min(190, Math.max(45, width / 8)));
      drops = Array.from({length: count}, () => spawn(true));
    };

    const draw = (step: number) => {
      ctx.clearRect(0, 0, width, height);

      for (const drop of drops) {
        drop.vx += (0.02 + lean) * drop.depth * step;
        drop.vy += 0.1 * drop.depth * step;

        if (pointer.active) {
          const dx = pointer.x - drop.x;
          const dy = pointer.y - drop.y;
          const dist = Math.hypot(dx, dy);

          // Bounded influence, and mostly tangential: a purely radial pull
          // captures everything into a knot at the cursor, where an orbit
          // curves the drop around and slings it back out.
          if (dist < 340 && dist > 0.5) {
            const falloff = 1 - dist / 340;
            const accel = 1.7 * falloff * falloff * drop.depth;
            const ux = dx / dist;
            const uy = dy / dist;
            drop.vx += (ux * 0.45 - uy * 0.9) * accel * step;
            drop.vy += (uy * 0.45 + ux * 0.9) * accel * step;

            // Repulsive core, so the orbit never collapses to a point.
            if (dist < 54) {
              const push = (1 - dist / 54) * 0.85 * step;
              drop.vx -= ux * push;
              drop.vy -= uy * push;
            }
          }
        }

        drop.vx *= 0.972;
        drop.vy *= 0.978;

        let speed = Math.hypot(drop.vx, drop.vy);
        if (speed > 16) {
          drop.vx = (drop.vx / speed) * 16;
          drop.vy = (drop.vy / speed) * 16;
          speed = 16;
        }

        drop.x += drop.vx * step;
        drop.y += drop.vy * step;

        if (speed > 0.05) {
          const tail = Math.min(30, 3 + speed * 2.7) * (0.45 + drop.depth * 0.75);
          const nx = drop.vx / speed;
          const ny = drop.vy / speed;
          // Speed brightens the drop, so the pointer's wake reads as a lit
          // disturbance rather than a slightly denser patch of the same grey.
          const alpha = 0.1 + drop.depth * 0.3 + Math.min(0.34, speed * 0.032);
          ctx.strokeStyle = drop.red
            ? `rgba(215, 90, 74, ${alpha})`
            : `rgba(76, 164, 232, ${alpha})`;
          ctx.lineWidth = drop.depth > 0.72 ? 1.4 : 1;
          ctx.beginPath();
          ctx.moveTo(drop.x - nx * tail, drop.y - ny * tail);
          ctx.lineTo(drop.x, drop.y);
          ctx.stroke();
        }

        if (drop.y > height + 80 || drop.x < -140 || drop.x > width + 140) {
          Object.assign(drop, spawn(false));
        }
      }
    };

    const tick = (now: number) => {
      const step = Math.min(3, (now - previous) / 16.667) || 1;
      previous = now;
      lean *= 0.92;
      draw(step);
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame || calm.matches) return;
      previous = performance.now();
      frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (!frame) return;
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!fine.matches) return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    const onScroll = () => {
      const delta = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      lean = Math.max(-0.5, Math.min(0.5, lean - delta * 0.004));
    };

    const onMotionChange = () => {
      stop();
      if (calm.matches) {
        draw(1);
      } else {
        start();
      }
    };

    resize();

    const host = canvas.parentElement ?? canvas;
    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      {rootMargin: '120px'},
    );
    observer.observe(canvas);

    const sizeObserver = new ResizeObserver(() => {
      resize();
      if (calm.matches) draw(1);
    });
    sizeObserver.observe(canvas);

    host.addEventListener('pointermove', onPointerMove);
    host.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('scroll', onScroll, {passive: true});
    calm.addEventListener('change', onMotionChange);

    if (calm.matches) draw(1);

    return () => {
      stop();
      observer.disconnect();
      sizeObserver.disconnect();
      host.removeEventListener('pointermove', onPointerMove);
      host.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('scroll', onScroll);
      calm.removeEventListener('change', onMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.heroField} aria-hidden />;
}

function Hero() {
  return (
    <header className={styles.hero}>
      <div className={styles.heroAtmosphere} aria-hidden />
      <HeroField />
      <div className="container">
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <Heading as="h1" className={styles.heroTitle}>
              Give your home
              <span>new forces.</span>
            </Heading>
            <p className={styles.heroLead}>
              Lucia is a self-hosted voice agent for Home Assistant. Every request it handles is on
              the record, timed, and yours to inspect.
            </p>
            <div className={styles.heroActions}>
              <Link className={styles.primaryAction} to="/docs/deployment/overview">
                Deploy Lucia
                <ArrowRight aria-hidden />
              </Link>
              <Link className={styles.textAction} to="/docs/agents/custom-agents">
                Build a custom agent
              </Link>
            </div>
            <ul className={styles.heroFacts}>
              <li><ShieldCheck aria-hidden /> Runs on your hardware, under your rules</li>
              <li><CloudCog aria-hidden /> Local, hybrid, or cloud models — your call</li>
              <li><PackageOpen aria-hidden /> Open source, MIT licensed</li>
            </ul>
          </div>
          <figure className={styles.heroEvidence}>
            <img
              src="/img/dashboard/traces.png"
              alt="The Lucia dashboard Traces page, listing spoken requests with the agents that handled them and how long each took."
              width={1440}
              height={900}
              loading="eager"
              decoding="async"
            />
            <figcaption>
              <span>Traces — every request, kept</span>
              <span>480 handled in this capture</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </header>
  );
}

const extensionSteps = [
  {
    icon: Braces,
    title: 'Define the pull',
    body: 'Give the agent a domain, description, and discoverable agent card so Lucia knows when it belongs in the field.',
  },
  {
    icon: PlugZap,
    title: 'Attach real tools',
    body: 'Connect Home Assistant services, MCP servers, plugins, or your own APIs behind a focused specialist.',
  },
  {
    icon: GitBranch,
    title: 'Choose the boundary',
    body: 'Keep the agent in-process or move it behind A2AHost without changing the orchestration contract.',
  },
  {
    icon: Activity,
    title: 'Watch every route',
    body: 'Inspect the selected agent, tool work, latency, and response in Lucia traces instead of debugging a black box.',
  },
];

function ExtensionSection() {
  return (
    <section id="extend" className={styles.extensionSection}>
      <div className="container">
        <div className={styles.sectionIntro}>
          <Heading as="h2">A new agent is a new law of motion.</Heading>
          <p>
            Lucia does not make every domain fit one prompt. It gives specialists a common route,
            tool, and observation model.
          </p>
        </div>
        <div className={styles.extensionSequence}>
          {extensionSteps.map(({icon: Icon, title, body}, index) => (
            <article key={title} className={styles.extensionStep}>
              <span className={styles.extensionIndex}>0{index + 1}</span>
              <Icon aria-hidden />
              <div>
                <Heading as="h3">{title}</Heading>
                <p>{body}</p>
              </div>
            </article>
          ))}
        </div>
        <div className={styles.extensionActions}>
          <Link className={styles.primaryAction} to="/docs/agents/custom-agents">
            Custom agent guide <ArrowRight aria-hidden />
          </Link>
          <Link className={styles.textAction} to="/docs/api/a2a-protocol">
            Read the A2A API
          </Link>
        </div>
      </div>
    </section>
  );
}

function PluginSection() {
  return (
    <section className={styles.pluginSection}>
      <div className="container">
        <div className={styles.pluginHeader}>
          <div>
            <Heading as="h2">Extensions that ship today.</Heading>
          </div>
          <Link className={styles.textAction} to="/plugins">
            Browse all plugins
          </Link>
        </div>
        <div className={styles.pluginLines}>
          {plugins.map((plugin) => (
            <Link key={plugin.id} className={styles.pluginLine} to={plugin.docsUrl}>
              <PlugZap aria-hidden />
              <strong>{plugin.name}</strong>
              <span>{plugin.description}</span>
              <ArrowRight aria-hidden />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function EvidenceSection() {
  return (
    <section className={styles.evidenceSection}>
      <div className="container">
        <div className={styles.evidenceGrid}>
          <div className={styles.evidenceCopy}>
            <Heading as="h2">The whole mesh, measured.</Heading>
            <p>
              Request volume, error rate, cache hits, and how much work each agent is actually
              doing—so a slow night is a number you can look at, not a feeling.
            </p>
            <dl className={styles.evidenceFacts}>
              <div><dt>Routing</dt><dd>specialist selected</dd></div>
              <div><dt>Execution</dt><dd>tool calls visible</dd></div>
              <div><dt>Models</dt><dd>assigned per agent</dd></div>
              <div><dt>Telemetry</dt><dd>OpenTelemetry export</dd></div>
            </dl>
            <Link className={styles.textAction} to="/docs/dashboard/activity">
              Read the activity dashboard <ArrowRight aria-hidden />
            </Link>
          </div>
          <figure className={styles.traceFigure}>
            <img
              src="/img/dashboard/activity.png"
              alt="The Lucia dashboard Activity page, showing platform metrics, the live agent mesh, and per-agent request counts."
              width={1440}
              height={900}
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              Real Lucia dashboard capture
              <span>Platform metrics and live agent mesh</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

const deploymentPaths = [
  {
    icon: ServerCog,
    title: 'Docker Compose',
    body: 'Start with the complete self-hosted stack and choose your model and data providers.',
    to: '/docs/deployment/docker-compose',
  },
  {
    icon: Network,
    title: 'Kubernetes + Helm',
    body: 'Run mesh deployments and move selected agents behind A2AHost services.',
    to: '/docs/deployment/kubernetes',
  },
  {
    icon: TerminalSquare,
    title: 'systemd',
    body: 'Operate Lucia as native Linux services with explicit host-level control.',
    to: '/docs/deployment/systemd',
  },
];

function DeploymentSection() {
  return (
    <section id="deploy" className={styles.deploymentSection}>
      <div className="container">
        <div className={styles.sectionIntro}>
          <Heading as="h2">Run it where your trust model lives.</Heading>
          <p>
            Keep the same agents and observability across local, hybrid, and cloud-backed model paths.
          </p>
        </div>
        <div className={styles.deploymentPaths}>
          {deploymentPaths.map(({icon: Icon, title, body, to}) => (
            <Link key={title} className={styles.deploymentPath} to={to}>
              <Icon aria-hidden />
              <Heading as="h3">{title}</Heading>
              <p>{body}</p>
              <span>Open guide <ArrowRight aria-hidden /></span>
            </Link>
          ))}
        </div>
        <div className={styles.applianceNote}>
          <PackageOpen aria-hidden />
          <div>
            <strong>Prefer an appliance?</strong>
            <span>Flash supported Jetson hardware and finish setup from your phone.</span>
          </div>
          <Link to="/docs/getting-started/appliance-os">Explore Appliance OS</Link>
        </div>
      </div>
    </section>
  );
}

function FinalSection() {
  return (
    <section className={styles.finalSection}>
      <div className={styles.finalField} aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <div className="container">
        <div className={styles.finalContent}>
          <div>
            <CloudCog aria-hidden />
            <Heading as="h2">Your home stays yours.</Heading>
            <p>Deploy Lucia, connect Home Assistant, and make the next specialist yours.</p>
          </div>
          <div className={styles.finalActions}>
            <Link className={styles.primaryAction} to="/docs/deployment/overview">
              Open deployment guide <ArrowRight aria-hidden />
            </Link>
            <Link className={styles.textAction} to="https://github.com/seiggy/lucia-dotnet">
              Explore the source
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage(): ReactNode {
  return (
    <Layout
      title="Extensible AI Home Assistant"
      description="Lucia is an open-source, extensible AI assistant for Home Assistant with inspectable multi-agent routing and self-hosted deployment options.">
      <main className="gravity-page">
        <Hero />
        <nav className={styles.jumpNav} aria-label="Landing page sections">
          <a href="#extend">Extend</a>
          <a href="#deploy">Deploy</a>
          <Link to="/docs/architecture/overview">Architecture</Link>
          <Link to="/docs/dashboard/traces">Traces</Link>
        </nav>
        <ExtensionSection />
        <PluginSection />
        <EvidenceSection />
        <DeploymentSection />
        <FinalSection />
      </main>
    </Layout>
  );
}
