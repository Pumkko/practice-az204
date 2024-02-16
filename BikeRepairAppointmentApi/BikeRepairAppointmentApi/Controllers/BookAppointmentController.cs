using Azure.Identity;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;
using BikeRepairAppointmentApi.Config;
using BikeRepairAppointmentApi.Inputs;
using BikeRepairAppointmentApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Fluent;
using System.Security.Claims;

namespace BikeRepairAppointmentApi.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class BookAppointmentController(IConfiguration configuration) : ControllerBase
    {


        [HttpGet]
        public async Task<IActionResult> GetStorageSasUriForAppointment([FromBody] BookAppointmentInput bookAppointmentInput)
        {
            var storageAccountName = configuration["storageAccountName"];

            if (storageAccountName == null)
            {
                throw new Exception("Invalid configuration storageAccountName");
            }

            string endpoint = $"https://{storageAccountName}.blob.core.windows.net";

            var credentials = new ChainedTokenCredential(new ManagedIdentityCredential(), new AzureCliCredential());
            var successReadUserId = Guid.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var userId);
            if (!successReadUserId)
            {
                return new BadRequestResult();
            }

            var blobContainerName = $"{userId}-at-{bookAppointmentInput.Date.Ticks}";
            var blobServiceClient = new BlobServiceClient(new Uri(endpoint), credentials);
            var container = await blobServiceClient.CreateBlobContainerAsync(blobContainerName);

            var userDelegationKey = await blobServiceClient.GetUserDelegationKeyAsync(DateTimeOffset.UtcNow, DateTimeOffset.UtcNow.AddMinutes(5));
            var sasUriBuilder = new BlobSasBuilder()
            {
                BlobContainerName = blobContainerName,
                Resource = "c",
                StartsOn = DateTimeOffset.UtcNow,
                ExpiresOn = DateTimeOffset.UtcNow.AddMinutes(5)
            };

            sasUriBuilder.SetPermissions(BlobContainerSasPermissions.All);

            var blobUriBuilder = new BlobUriBuilder(blobServiceClient.Uri)
            {
                Sas = sasUriBuilder.ToSasQueryParameters(userDelegationKey, storageAccountName)
            };

            var blobContainerClient = new BlobContainerClient(container.Value.Uri, new Azure.AzureSasCredential(blobUriBuilder.Sas.ToString()));
            var blobClient = blobContainerClient.GetBlobClient("whatsupdoug.jpg");
            await blobClient.UploadAsync("C:\\Users\\Puma\\Pictures\\whatsupdoug.jpg");

            return Ok(blobUriBuilder.ToUri());
        }


        [HttpPost]
        public async Task<IActionResult> PostAppointment([FromBody] BookAppointmentInput bookAppointmentInput)
        {
            var successReadUserId = Guid.TryParse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value, out var userId);
            if (!successReadUserId)
            {
                return new BadRequestResult();
            }

            var databaseConfig = configuration.GetSection(CosmosDbConfig.ConfigKey).Get<CosmosDbConfig>();
            if (databaseConfig == null)
            {
                throw new Exception("Bad configuration CosmosDbConfig");
            }

            var cosmosClient = new CosmosClientBuilder(databaseConfig.DatabaseConnectionString)
                .WithSerializerOptions(new CosmosSerializationOptions()
                {
                    PropertyNamingPolicy = CosmosPropertyNamingPolicy.CamelCase
                }).Build();

            var database = cosmosClient.GetDatabase(databaseConfig.DatabaseName);
            var container = database.GetContainer(databaseConfig.ContainerName);

            var repairTask = new BikeRepairTask(userId, bookAppointmentInput.Date);
            try
            {

                await container.UpsertItemAsync(repairTask, new PartitionKey(userId.ToString()));

                return Ok(repairTask);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw;
            }

        }
    }
}
