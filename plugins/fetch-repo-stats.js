const fs = require('fs');
const path = require('path');
const https = require('https');

const REPO_API_URL = 'https://api.github.com/repos/seiggy/lucia-dotnet';
const OUTPUT_PATH = path.resolve(__dirname, '../static/data/repo-stats.json');

function fetchRepoStats() {
  return new Promise((resolve, reject) => {
    const request = https.get(
      REPO_API_URL,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': 'lucia-ai-site-builder',
        },
      },
      (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} fetching ${REPO_API_URL}`));
          return;
        }

        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            const data = JSON.parse(body);
            const stars = Number(data.stargazers_count);
            const forks = Number(data.forks_count);
            const openIssues = Number(data.open_issues_count);

            if (![stars, forks, openIssues].every(Number.isFinite)) {
              reject(new Error('GitHub API response missing expected numeric fields'));
              return;
            }

            resolve({
              stars,
              forks,
              openIssues,
              fetchedAt: new Date().toISOString(),
              source: REPO_API_URL,
            });
          } catch (error) {
            reject(error);
          }
        });
      },
    );

    request.on('error', reject);
  });
}

module.exports = function fetchRepoStatsPlugin() {
  return {
    name: 'fetch-repo-stats',
    async loadContent() {
      fs.mkdirSync(path.dirname(OUTPUT_PATH), {recursive: true});

      try {
        console.log('[fetch-repo-stats] Fetching repository stats from GitHub API...');
        const stats = await fetchRepoStats();
        fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(stats, null, 2)}\n`, 'utf8');
        console.log(
          `[fetch-repo-stats] Wrote stars=${stats.stars}, forks=${stats.forks}, openIssues=${stats.openIssues}`,
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        if (!fs.existsSync(OUTPUT_PATH)) {
          const fallbackStats = {
            stars: 0,
            forks: 0,
            openIssues: 0,
            fetchedAt: new Date().toISOString(),
            source: 'fallback',
          };
          fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(fallbackStats, null, 2)}\n`, 'utf8');
          console.warn(
            `[fetch-repo-stats] Failed to fetch live stats (${message}). Wrote fallback stats file.`,
          );
          return;
        }

        console.warn(
          `[fetch-repo-stats] Failed to fetch live stats (${message}). Using existing stats file.`,
        );
      }
    },
  };
};
