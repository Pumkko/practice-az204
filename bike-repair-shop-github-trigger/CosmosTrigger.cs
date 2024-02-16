using System;
using System.Collections.Generic;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace pumkko.bikerepairshop;

public class CosmosTrigger
{
    private readonly ILogger _logger;

    public CosmosTrigger(ILoggerFactory loggerFactory)
    {
        _logger = loggerFactory.CreateLogger<CosmosTrigger>();
    }

    [Function("CosmosTrigger")]
    public void Run([CosmosDBTrigger(
            databaseName: "BikeRepairShop",
            containerName: "RepairTasks",
            Connection = "practiceaz204bikerepair_DOCUMENTDB",
            LeaseContainerName = "leases",
            CreateLeaseContainerIfNotExists = true)] IReadOnlyList<BikeRepairTask> input)
    {
        _logger.LogInformation("In Trigger");
        if (input != null && input.Count > 0)
        {
            _logger.LogInformation("Documents modified: " + input.Count);
            _logger.LogInformation("First document Id: " + input[0].id);
        }
    }
}



public enum BikeRepairTaskStatus
{
    AwaitingAppointment = 0,
    Ongoing = 1,
    AwaitingParts = 2,
    Completed = 3
}


public record BikeRepairTask
{

    public required Guid id { get; set; }

    public required Guid clientId { get; set; }

    public required DateTime appointmentDate { get; set; }

    public required BikeRepairTaskStatus status { get; set; }
}

