using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using RepoStatsFunction.Services;

namespace RepoStatsFunction;

public sealed class StatsFunction(RepoStatsService repoStatsService, ILogger<StatsFunction> logger)
{
  private const string DefaultAllowedOrigin = "https://luciahome.net";
  private static readonly string[] AllowedOrigins = ParseAllowedOrigins(
    Environment.GetEnvironmentVariable("LUCIA_STATS_ALLOWED_ORIGINS")
  );
  private static readonly string[] AllowedMethods = ["GET", "OPTIONS"];

  [Function(nameof(GetStats))]
  public async Task<HttpResponseData> GetStats(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", "options", Route = "stats")] HttpRequestData req,
    CancellationToken cancellationToken
  )
  {
    var origin = SelectCorsOrigin(req);
    if (string.Equals(req.Method, "OPTIONS", StringComparison.OrdinalIgnoreCase))
    {
      var preflight = req.CreateResponse(HttpStatusCode.NoContent);
      AddCorsHeaders(preflight, origin);
      return preflight;
    }

    try
    {
      var stats = await repoStatsService.GetStatsAsync(cancellationToken);
      var response = req.CreateResponse(HttpStatusCode.OK);
      AddCorsHeaders(response, origin);
      await response.WriteAsJsonAsync(
        new
        {
          stars = stats.Stars,
          forks = stats.Forks,
          openIssues = stats.OpenIssues,
          dockerPulls = stats.DockerPulls,
          fetchedAt = stats.FetchedAt,
          source = new
          {
            github = stats.GitHubSource,
            dockerHub = stats.DockerHubSource,
          },
        },
        cancellationToken
      );
      return response;
    }
    catch (Exception ex)
    {
      logger.LogError(ex, "Failed to retrieve repository stats.");
      var response = req.CreateResponse(HttpStatusCode.BadGateway);
      AddCorsHeaders(response, origin);
      await response.WriteAsJsonAsync(
        new
        {
          error = "Unable to fetch upstream repository statistics.",
          details = ex.Message,
        },
        cancellationToken
      );
      return response;
    }
  }

  private static string? SelectCorsOrigin(HttpRequestData req)
  {
    if (!req.Headers.TryGetValues("Origin", out var values))
    {
      return AllowedOrigins[0];
    }

    var origin = values.FirstOrDefault()?.Trim();
    return AllowedOrigins.FirstOrDefault(allowed =>
      string.Equals(origin, allowed, StringComparison.OrdinalIgnoreCase)
    );
  }

  private static void AddCorsHeaders(HttpResponseData response, string? origin)
  {
    if (!string.IsNullOrWhiteSpace(origin))
    {
      response.Headers.Add("Access-Control-Allow-Origin", origin);
      response.Headers.Add("Vary", "Origin");
    }

    response.Headers.Add("Access-Control-Allow-Methods", string.Join(", ", AllowedMethods));
    response.Headers.Add("Access-Control-Allow-Headers", "Content-Type");
    response.Headers.Add("Access-Control-Max-Age", "86400");
  }

  private static string[] ParseAllowedOrigins(string? rawOrigins)
  {
    var parsed = rawOrigins?
      .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
      .Distinct(StringComparer.OrdinalIgnoreCase)
      .ToArray();

    if (parsed is {Length: > 0})
    {
      return parsed;
    }

    return [DefaultAllowedOrigin];
  }
}
