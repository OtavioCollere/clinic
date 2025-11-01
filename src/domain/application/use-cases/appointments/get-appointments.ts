import { makeLeft, makeRight, type Either } from "@/core/either/either";
import { AppointmentNotFoundError } from "@/core/errors/appointment-not-foundd-error";
import type { Appointment } from "@/domain/enterprise/entities/appointment";
import type { AppointmentsRepository } from "../../repositories/appointment-repository";

interface GetAppointmentUseCaseRequest {
  appointmentId: string;
}

type GetAppointmentUseCaseResponse = Either<
  AppointmentNotFoundError,
  {
    appointment: Appointment;
  }
>;

export class GetAppointmentUseCase {
  constructor(private appointmentsRepository: AppointmentsRepository) {}

  async execute({
    appointmentId,
  }: GetAppointmentUseCaseRequest): Promise<GetAppointmentUseCaseResponse> {
    const appointment = await this.appointmentsRepository.findById(appointmentId);

    if (!appointment) {
      return makeLeft(new AppointmentNotFoundError());
    }

    return makeRight({
      appointment,
    });
  }
}
