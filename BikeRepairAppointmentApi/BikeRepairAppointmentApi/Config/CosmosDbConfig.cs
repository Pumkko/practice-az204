namespace BikeRepairAppointmentApi.Config
{
    public class CosmosDbConfig
    {
        public const string ConfigKey = "cosmosDb";
         
        public required string DatabaseConnectionString { get; set; }   

        // I leave those properties in case i want to try RBAC again

        public required string AccountEndpoint {  get; set; }   
        public required string DatabaseName { get; set; }

        public required string ContainerName { get; set; }  


    }
}
