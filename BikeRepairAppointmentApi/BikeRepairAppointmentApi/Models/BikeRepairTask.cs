using System.Globalization;
using System.Text.Json.Serialization;

namespace BikeRepairAppointmentApi.Models
{

    public enum BikeRepairTaskStatus
    {
        AwaitingAppointment=0,
        Ongoing = 1,
        AwaitingParts = 2,
        Completed = 3
    }

    public record BikeRepairTask
    {

        public Guid Id { get; set; }

        public Guid ClientId { get; set; }
        
        public DateTime AppointmentDate { get; set; }

        public BikeRepairTaskStatus Status { get; set;}

        public BikeRepairTask(Guid clientId, DateTime appointmentDate)
        {
            ClientId = clientId;
            Id = Guid.NewGuid();
            AppointmentDate = appointmentDate;
            Status = BikeRepairTaskStatus.AwaitingAppointment;

        }
    }
}
