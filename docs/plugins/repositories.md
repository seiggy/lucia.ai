---
sidebar_position: 5
title: Plugin Repositories
---

# Plugin Repositories

Plugin repositories are collections of plugins that Lucia can discover and install. Repositories are defined by a manifest file and can be served from a local directory or a Git-hosted source.

## Repository Manifest

Every repository must contain a `lucia-plugins.json` manifest at its root. This file describes the repository and lists all available plugins.

```json
{
  "id": "my-plugin-repo",
  "name": "My Plugin Repository",
  "plugins": [
    {
      "id": "example-plugin",
      "name": "Example Plugin",
      "description": "A sample plugin demonstrating the repository format.",
      "version": "1.0.0",
      "path": "plugins/example-plugin",
      "author": "Your Name",
      "tags": ["example", "demo"]
    },
    {
      "id": "another-plugin",
      "name": "Another Plugin",
      "description": "Another plugin in the same repository.",
      "version": "2.1.0",
      "path": "plugins/another-plugin",
      "author": "Your Name",
      "tags": ["utilities"]
    }
  ]
}
```

### Manifest Fields

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique repository identifier. |
| `name` | `string` | Human-readable repository name. |
| `plugins` | `array` | List of plugin entries. |
| `plugins[].id` | `string` | Unique plugin identifier within the repository. |
| `plugins[].name` | `string` | Display name of the plugin. |
| `plugins[].description` | `string` | Short description of what the plugin does. |
| `plugins[].version` | `string` | Semantic version string. |
| `plugins[].path` | `string` | Relative path to the plugin folder within the repository. |
| `plugins[].author` | `string` | Plugin author name. |
| `plugins[].tags` | `string[]` | Tags for categorization and search. |

## Source Types

Lucia supports two repository source types, each suited to different workflows.

### LocalPluginRepositorySource

Reads plugins directly from a local filesystem path. Ideal for development and testing.

```json
{
  "id": "local-dev",
  "name": "Local Development Plugins",
  "type": "local",
  "path": "/home/user/lucia-plugins"
}
```

The path must point to a directory containing `lucia-plugins.json` and the plugin folders referenced by it.

:::tip
Use a local source during development to iterate on your plugin without pushing to a remote repository. Changes are picked up on sync or restart.
:::

### GitPluginRepositorySource

Fetches plugins from a Git-hosted repository (GitHub, GitLab, etc.). This is the recommended source type for production deployments and shared plugin distribution.

```json
{
  "id": "official",
  "name": "Lucia Official Plugins",
  "type": "git",
  "url": "https://github.com/lucia-ai/plugins",
  "blobSourceStrategy": "release"
}
```

## Git Blob Source Strategies

When using a Git repository source, you must choose how Lucia retrieves plugin files. Three strategies are available:

### release (default)

Downloads plugin files from **GitHub Release assets**. This is the default and recommended strategy for production use.

- Lucia fetches the `lucia-plugins.json` manifest from the latest release.
- Individual plugins are downloaded as release asset archives.
- Provides stable, versioned snapshots.

```json
{
  "blobSourceStrategy": "release"
}
```

### tag

Fetches plugin files from a specific **Git tag**.

- Lucia reads the manifest and plugin files from the tagged commit.
- Useful when you want to pin to a specific version without using GitHub Releases.

```json
{
  "blobSourceStrategy": "tag"
}
```

### branch

Fetches plugin files directly from a **Git branch** (e.g., `main`).

- Always pulls the latest commit on the configured branch.
- Useful for testing pre-release plugins.

```json
{
  "blobSourceStrategy": "branch"
}
```

:::warning
The `branch` strategy always fetches the latest state of the branch. This means plugin versions may change unexpectedly between syncs. Use `release` or `tag` for stable deployments.
:::

## Creating Your Own Repository

Follow these steps to create and publish your own plugin repository:

1. **Create a Git repository** (or a local directory).

2. **Add your plugin folders**, each containing a `plugin.cs` entry point:

   ```
   my-repo/
     lucia-plugins.json
     plugins/
       my-plugin/
         plugin.cs
       another-plugin/
         plugin.cs
   ```

3. **Write the manifest** (`lucia-plugins.json`) listing every plugin with its metadata and relative path.

4. **Publish:**
   - For **Git repositories**, push to your remote and optionally create a release.
   - For **local repositories**, point the `path` field to the directory on disk.

5. **Register the repository** in Lucia using the [Plugin API](./api.md):

   ```http
   POST /api/plugins/repositories
   ```

   ```json
   {
     "id": "my-repo",
     "name": "My Plugin Repository",
     "type": "git",
     "url": "https://github.com/myorg/lucia-plugins",
     "blobSourceStrategy": "release"
   }
   ```

6. **Sync** the repository to fetch the manifest:

   ```http
   POST /api/plugins/repositories/my-repo/sync
   ```

7. **Browse and install** plugins from your repository via the store API or the dashboard.
