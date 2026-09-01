const fs = require('fs');
const path = require('path');
const https = require('https');

const RELEASES_URL =
  'https://api.github.com/repos/seiggy/lucia-dotnet/releases?per_page=100';
const REPO_BLOB_BASE =
  'https://github.com/seiggy/lucia-dotnet/blob/master/';
const OUTPUT_PATH = path.resolve(
  __dirname,
  '../docs/project/changelog.md',
);

/**
 * Rewrite relative markdown links to absolute GitHub URLs.
 * Matches [text](relative-path) but skips links that already have a protocol
 * (http://, https://, mailto:, #anchors).
 */
function rewriteRelativeLinks(md) {
  return md.replace(
    /\[([^\]]*)\]\((?!https?:\/\/|mailto:|#)([^)]+)\)/g,
    (_match, text, href) => `[${text}](${REPO_BLOB_BASE}${href})`,
  );
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const get = (targetUrl) => {
      https.get(targetUrl, {
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': 'lucia.ai-docs',
        },
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          get(res.headers.location);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} fetching ${targetUrl}`));
          return;
        }
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve(data));
        res.on('error', reject);
      }).on('error', reject);
    };
    get(url);
  });
}

module.exports = function fetchChangelogPlugin(_context, _options) {
  return {
    name: 'fetch-changelog',
    async loadContent() {
      try {
        console.log('[fetch-changelog] Fetching releases from lucia-dotnet...');
        const releases = JSON.parse(await fetchUrl(RELEASES_URL));
        const content = releases
          .filter((release) => !release.draft)
          .map((release) => {
            const name = release.name || release.tag_name;
            const date = new Date(release.published_at).toISOString().slice(0, 10);
            const body = rewriteRelativeLinks(release.body || 'No release notes provided.')
              .replace(/\r\n?/g, '\n')
              .replace(/[ \t]+$/gm, '');
            return `# [${name}](${release.html_url})\n\n**Published:** ${date}\n\n${body}`;
          })
          .join('\n\n---\n\n');
        const frontmatter = `---
sidebar_position: 5
title: Changelog
---

`;
        fs.writeFileSync(OUTPUT_PATH, frontmatter + content, 'utf8');
        console.log(
          `[fetch-changelog] Wrote ${releases.length} releases to changelog.md`,
        );
      } catch (err) {
        console.warn(
          `[fetch-changelog] Failed to fetch changelog: ${err.message}. Using existing file.`,
        );
      }
    },
  };
};
