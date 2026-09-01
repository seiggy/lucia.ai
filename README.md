# Lucia.ai website

The Lucia website uses [Docusaurus](https://docusaurus.io/).

## Installation

```bash
npm ci
```

## Local Development

```bash
npm start
```

The development server opens the site in a browser and reloads most changes without a restart.

## Build

```bash
npm run build
```

The build writes the static site to `build`.

## Deployment

```bash
npm run deploy
```

Wrangler builds the site and deploys `build` to the Cloudflare Worker configured in `wrangler.jsonc`. Use `npm run preview` for a local Worker preview.

## Azure Function: live repo stats API

`functions/repo-stats-function` exposes live stats for:

- GitHub repo `seiggy/lucia-dotnet` (`stars`, `forks`, `openIssues`)
- Docker Hub image `seiggy/lucia-agenthost` (`dockerPulls`)

### Build and run locally

```bash
cd functions/repo-stats-function
dotnet build
```

Requires .NET 10 SDK.

To run locally with Azure Functions Core Tools, copy `local.settings.json.example` to `local.settings.json`.

### CORS

The function supports a configurable allowlist via `LUCIA_STATS_ALLOWED_ORIGINS` (defaults to `https://luciahome.net`).
For production, also set Azure Function App CORS to `https://luciahome.net` in the Azure portal.

### GitHub Actions deployment

Workflow: `.github/workflows/deploy-function.yml`

Set these repository secrets (Settings -> Secrets and variables -> Actions -> Secrets):

- `AZURE_CLIENT_ID` (OIDC app registration client ID)
- `AZURE_TENANT_ID`
- `AZURE_SUBSCRIPTION_ID`

Set these repository variables (Settings -> Secrets and variables -> Actions -> Variables):

- `AZURE_FUNCTIONAPP_NAME` (for example: `lucia-repo-stats-func`)
- `AZURE_FUNCTIONAPP_RESOURCE_GROUP` (for example: `rg-lucia-prod`)
- `LUCIA_STATS_API_URL` (for docs build, for example: `https://<function-app-name>.azurewebsites.net/api/stats`)

Set this Function App setting in Azure (`Configuration` -> `Application settings`):

- `LUCIA_STATS_ALLOWED_ORIGINS=https://luciahome.net`
