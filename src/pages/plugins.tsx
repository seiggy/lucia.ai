import type {ReactNode} from 'react';
import {useState, useMemo} from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import pluginsData from '@site/src/data/plugins.json';

interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  tags: string[];
  path: string;
  docsUrl: string;
  repoUrl: string;
}

function PluginCard({plugin}: {plugin: Plugin}) {
  return (
    <div className="plugin-card">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem'}}>
        <Heading as="h3" style={{margin: 0}}>{plugin.name}</Heading>
        <span style={{
          fontSize: '0.8rem',
          padding: '0.15rem 0.5rem',
          borderRadius: '4px',
          background: 'var(--ifm-color-primary)',
          color: '#fff',
          fontWeight: 500,
        }}>
          v{plugin.version}
        </span>
      </div>
      <p style={{marginBottom: '0.75rem', opacity: 0.9}}>{plugin.description}</p>
      <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem'}}>
        {plugin.tags.map((tag) => (
          <span key={tag} style={{
            fontSize: '0.75rem',
            padding: '0.1rem 0.5rem',
            borderRadius: '12px',
            border: '1px solid var(--ifm-color-primary)',
            color: 'var(--ifm-color-primary)',
          }}>
            {tag}
          </span>
        ))}
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem'}}>
        <span style={{opacity: 0.7}}>by {plugin.author}</span>
        <div style={{display: 'flex', gap: '0.75rem'}}>
          <Link to={plugin.docsUrl}>Docs</Link>
          <Link to={plugin.repoUrl}>Source</Link>
        </div>
      </div>
    </div>
  );
}

export default function PluginsPage(): ReactNode {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    pluginsData.forEach((p: Plugin) => p.tags.forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, []);

  const filteredPlugins = useMemo(() => {
    return (pluginsData as Plugin[]).filter((plugin) => {
      const matchesSearch = !search ||
        plugin.name.toLowerCase().includes(search.toLowerCase()) ||
        plugin.description.toLowerCase().includes(search.toLowerCase());
      const matchesTag = !selectedTag || plugin.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [search, selectedTag]);

  return (
    <Layout title="Plugins" description="Browse Lucia plugins for extending your AI home assistant.">
      <div className="container" style={{padding: '2rem 0'}}>
        <div style={{textAlign: 'center', marginBottom: '2rem'}}>
          <Heading as="h1">Plugin Gallery</Heading>
          <p>Extend Lucia with community and official plugins. No compilation required.</p>
        </div>

        <div style={{display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center'}}>
          <input
            type="text"
            placeholder="Search plugins..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--ifm-color-emphasis-300)',
              background: 'var(--ifm-background-surface-color)',
              color: 'var(--ifm-font-color-base)',
              fontSize: '1rem',
              minWidth: '250px',
            }}
          />
          <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
            <button
              onClick={() => setSelectedTag(null)}
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: '16px',
                border: `1px solid ${!selectedTag ? 'var(--ifm-color-primary)' : 'var(--ifm-color-emphasis-300)'}`,
                background: !selectedTag ? 'var(--ifm-color-primary)' : 'transparent',
                color: !selectedTag ? '#fff' : 'var(--ifm-font-color-base)',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: '16px',
                  border: `1px solid ${selectedTag === tag ? 'var(--ifm-color-primary)' : 'var(--ifm-color-emphasis-300)'}`,
                  background: selectedTag === tag ? 'var(--ifm-color-primary)' : 'transparent',
                  color: selectedTag === tag ? '#fff' : 'var(--ifm-font-color-base)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem',
        }}>
          {filteredPlugins.map((plugin) => (
            <PluginCard key={plugin.id} plugin={plugin} />
          ))}
        </div>

        {filteredPlugins.length === 0 && (
          <div style={{textAlign: 'center', padding: '3rem', opacity: 0.6}}>
            <p>No plugins match your search.</p>
          </div>
        )}

        <div className="cta-section" style={{marginTop: '3rem'}}>
          <Heading as="h2">Create Your Own Plugin</Heading>
          <p>
            Plugins are plain C# scripts — no project files, no DLLs, no compilation step.
            Drop a folder with a <code>plugin.cs</code> and go.
          </p>
          <Link className="button button--primary button--lg" to="/docs/plugins/creating-plugins">
            Plugin Development Guide
          </Link>
        </div>
      </div>
    </Layout>
  );
}
