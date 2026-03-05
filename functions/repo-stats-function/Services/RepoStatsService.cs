using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Caching.Memory;

namespace RepoStatsFunction.Services;

public sealed class RepoStatsService(IHttpClientFactory httpClientFactory, IMemoryCache cache)
{
  public const string GitHubClientName = "GitHubApi";
  public const string DockerHubClientName = "DockerHubApi";

  public const string GitHubSource = "https://api.github.com/repos/seiggy/lucia-dotnet";
  public const string DockerHubSource = "https://hub.docker.com/v2/repositories/seiggy/lucia-agenthost/";

  private const string CacheKey = "repo-stats-cache";

  public async Task<RepoStatsPayload> GetStatsAsync(CancellationToken cancellationToken)
  {
    if (cache.TryGetValue<RepoStatsPayload>(CacheKey, out var cached) && cached is not null)
    {
      return cached;
    }

    var githubTask = FetchGitHubStatsAsync(cancellationToken);
    var dockerTask = FetchDockerHubPullsAsync(cancellationToken);

    await Task.WhenAll(githubTask, dockerTask);

    var githubStats = await githubTask;
    var dockerPullCount = await dockerTask;

    var payload = new RepoStatsPayload(
      githubStats.Stars,
      githubStats.Forks,
      githubStats.OpenIssues,
      dockerPullCount,
      DateTimeOffset.UtcNow,
      GitHubSource,
      DockerHubSource
    );

    cache.Set(
      CacheKey,
      payload,
      new MemoryCacheEntryOptions
      {
        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5),
      }
    );

    return payload;
  }

  private async Task<GitHubStats> FetchGitHubStatsAsync(CancellationToken cancellationToken)
  {
    var client = httpClientFactory.CreateClient(GitHubClientName);
    using var response = await client.GetAsync("repos/seiggy/lucia-dotnet", cancellationToken);
    if (!response.IsSuccessStatusCode)
    {
      throw new HttpRequestException(
        $"GitHub API request failed with status {(int)response.StatusCode} ({response.StatusCode})."
      );
    }

    await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
    using var document = await JsonDocument.ParseAsync(stream, cancellationToken: cancellationToken);
    var root = document.RootElement;

    var stars = ReadRequiredInt(root, "stargazers_count");
    var forks = ReadRequiredInt(root, "forks_count");
    var openIssues = ReadRequiredInt(root, "open_issues_count");

    return new GitHubStats(stars, forks, openIssues);
  }

  private async Task<long> FetchDockerHubPullsAsync(CancellationToken cancellationToken)
  {
    var client = httpClientFactory.CreateClient(DockerHubClientName);
    using var response = await client.GetAsync("v2/repositories/seiggy/lucia-agenthost/", cancellationToken);
    if (!response.IsSuccessStatusCode)
    {
      throw new HttpRequestException(
        $"Docker Hub API request failed with status {(int)response.StatusCode} ({response.StatusCode})."
      );
    }

    var payload = await response.Content.ReadFromJsonAsync<JsonElement>(cancellationToken);
    if (!payload.TryGetProperty("pull_count", out var pullCountElement) || !pullCountElement.TryGetInt64(out var pullCount))
    {
      throw new InvalidOperationException("Docker Hub API response missing numeric field pull_count.");
    }

    return pullCount;
  }

  private static int ReadRequiredInt(JsonElement root, string propertyName)
  {
    if (!root.TryGetProperty(propertyName, out var value))
    {
      throw new InvalidOperationException($"GitHub API response missing field {propertyName}.");
    }

    if (value.TryGetInt32(out var intValue))
    {
      return intValue;
    }

    if (value.TryGetInt64(out var longValue) && longValue <= int.MaxValue && longValue >= int.MinValue)
    {
      return (int)longValue;
    }

    throw new InvalidOperationException($"GitHub API field {propertyName} is not a valid integer.");
  }
}

public sealed record RepoStatsPayload(
  int Stars,
  int Forks,
  int OpenIssues,
  long DockerPulls,
  DateTimeOffset FetchedAt,
  string GitHubSource,
  string DockerHubSource
);

public sealed record GitHubStats(int Stars, int Forks, int OpenIssues);
