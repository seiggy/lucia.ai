# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Installation

```bash
yarn
```

## Local Development

```bash
yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Using SSH:

```bash
USE_SSH=true yarn deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

## Azure Function: live repo stats API

An Azure Functions project is available at `functions/repo-stats-function` to expose live stats for:

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
