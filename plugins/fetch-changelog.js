const fs = require('fs');
const path = require('path');
const https = require('https');

const CHANGELOG_URL =
  'https://raw.githubusercontent.com/seiggy/lucia-dotnet/refs/heads/master/RELEASE_NOTES.md';
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
      https.get(targetUrl, (res) => {
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
        console.log('[fetch-changelog] Fetching RELEASE_NOTES.md from lucia-dotnet...');
        let content = await fetchUrl(CHANGELOG_URL);
        content = rewriteRelativeLinks(content);
        const frontmatter = `---
sidebar_position: 5
title: Changelog
---

`;
        fs.writeFileSync(OUTPUT_PATH, frontmatter + content, 'utf8');
        console.log(
          `[fetch-changelog] Wrote ${(content.length / 1024).toFixed(1)}KB to changelog.md`,
        );
      } catch (err) {
        console.warn(
          `[fetch-changelog] Failed to fetch changelog: ${err.message}. Using existing file.`,
        );
      }
    },
  };
};
