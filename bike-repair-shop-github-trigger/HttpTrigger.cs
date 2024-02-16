using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using FromBodyAttribute = Microsoft.Azure.Functions.Worker.Http.FromBodyAttribute;

namespace pumkko.bikerepairshop
{
    public class HttpTrigger
    {
        private readonly ILogger<HttpTrigger> _logger;

        public HttpTrigger(ILogger<HttpTrigger> logger)
        {
            _logger = logger;
        }

        [Function("HttpTrigger")]
        public IActionResult Run([HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequest req, [FromBody] GithubGollumnEvent githubEvent)
        {
            var expectedGithubToken = Environment.GetEnvironmentVariable("GithubSecretToken", EnvironmentVariableTarget.Process);
            var successFromGithubSignature = req.Headers.TryGetValue("X-Hub-Signature-256", out var fromGithubSignatureHeaders);
            var fromGithubToken = fromGithubSignatureHeaders.First();

            if (!successFromGithubSignature || fromGithubToken == null)
            {
                return new BadRequestObjectResult(req.Headers);
            }

            if (expectedGithubToken == null)
            {
                throw new Exception("Missing GithubSecretToken configuration");
            }
            
            if (githubEvent == null)
            {
                return new BadRequestObjectResult(githubEvent);
            }

            if(expectedGithubToken != fromGithubToken){
                return new UnauthorizedResult();
            }

            _logger.LogInformation($"Triggered github event from repository {githubEvent.Repository.Name}");
            return new OkObjectResult("Welcome to Azure Functions!");
        }
    }
}
