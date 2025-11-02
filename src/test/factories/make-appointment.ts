import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Appointment, type AppointmentProps } from "@/domain/enterprise/entities/appointment";

export function makeAppointment(override: Partial<AppointmentProps>, id?: UniqueEntityID) {
  const appointment = Appointment.create(
    {
      userId: new UniqueEntityID(),
      professionalId: new UniqueEntityID(),
      name: "Test Appointment",
      description: "Test description",
      dateHour: new Date(),
      duration: 60,
      ...override,
    },
    id,
  );
  return appointment;
}
