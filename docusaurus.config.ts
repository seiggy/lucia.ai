import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Lucia',
  tagline: 'Privacy-First AI Home Assistant',
  favicon: 'img/lucia.png',

  future: {
    v4: true,
  },

  url: 'https://luciahome.net',
  baseUrl: '/',

  organizationName: 'seiggy',
  projectName: 'lucia.ai',

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    require.resolve('./plugins/fetch-changelog'),
    require.resolve('./plugins/fetch-repo-stats'),
  ],

  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        indexBlog: true,
        indexDocs: true,
        docsRouteBasePath: '/docs',
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/seiggy/lucia.ai/tree/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl: 'https://github.com/seiggy/lucia.ai/tree/main/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/lucia.png',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Lucia',
      logo: {
        alt: 'Lucia Logo',
        src: 'img/lucia.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {to: '/plugins', label: 'Plugins', position: 'left'},
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/seiggy/lucia-dotnet',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {label: 'Getting Started', to: '/docs/getting-started/introduction'},
            {label: 'Architecture', to: '/docs/architecture/overview'},
            {label: 'Agents', to: '/docs/agents/overview'},
            {label: 'Deployment', to: '/docs/deployment/overview'},
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub Discussions',
              href: 'https://github.com/seiggy/lucia-dotnet/discussions',
            },
            {
              label: 'GitHub Issues',
              href: 'https://github.com/seiggy/lucia-dotnet/issues',
            },
            {
              label: 'Home Assistant Forum',
              href: 'https://community.home-assistant.io/',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {label: 'Blog', to: '/blog'},
            {label: 'Plugins', to: '/plugins'},
            {
              label: 'GitHub',
              href: 'https://github.com/seiggy/lucia-dotnet',
            },
          ],
        },
      ],
      copyright: `Copyright ${new Date().getFullYear()} Lucia Contributors. Built with Docusaurus. Licensed under MIT.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['csharp', 'bash', 'yaml', 'json', 'python', 'docker'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
