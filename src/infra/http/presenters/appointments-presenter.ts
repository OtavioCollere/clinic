import { Appointment } from "@/domain/enterprise/entities/appointment";

export class AppointmentPresenter {
  static toHTTP(appointment: Appointment) {
    return {
      id: appointment.id.toString(),
      userId: appointment.userId.toString(),
      professionalId: appointment.professionalId.toString(),
      name: appointment.name,
      description: appointment.description,
      dateHour: appointment.dateHour,
      duration: appointment.duration,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
    };
  }
}
