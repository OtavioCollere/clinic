import type { Either } from "@/core/either/either";
import type { Appointment } from "@/domain/enterprise/entities/appointment";

interface CreateAppointmentUseCaseRequest {
  userId: string;
  professionalId: string;
  name: string;
  description?: string;
  dateHour: Date;
}

type CreateAppointmentUseCaseResponse = Either<
  null,
  {
    appointment: Appointment;
  }
>;

export class CreateAppointmentUseCase {
  async handle({}: CreateAppointmentUseCaseRequest): Promise<CreateAppointmentUseCaseResponse> {}
}
