using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using RepoStatsFunction.Services;

var host = new HostBuilder()
  .ConfigureFunctionsWorkerDefaults()
  .ConfigureServices((_, services) =>
  {
    services.AddMemoryCache();

    services.AddHttpClient(RepoStatsService.GitHubClientName, client =>
    {
      client.BaseAddress = new Uri("https://api.github.com/");
      client.DefaultRequestHeaders.Accept.ParseAdd("application/vnd.github+json");
      client.DefaultRequestHeaders.UserAgent.ParseAdd("luciahome-repo-stats-function/1.0");
      client.Timeout = TimeSpan.FromSeconds(10);
    });

    services.AddHttpClient(RepoStatsService.DockerHubClientName, client =>
    {
      client.BaseAddress = new Uri("https://hub.docker.com/");
      client.DefaultRequestHeaders.Accept.ParseAdd("application/json");
      client.DefaultRequestHeaders.UserAgent.ParseAdd("luciahome-repo-stats-function/1.0");
      client.Timeout = TimeSpan.FromSeconds(10);
    });

    services.AddSingleton<RepoStatsService>();
  })
  .Build();

host.Run();
