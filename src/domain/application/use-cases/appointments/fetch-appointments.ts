import { makeLeft, makeRight, type Either } from "@/core/either/either";
import { AppointmentNotFoundError } from "@/core/errors/appointment-not-foundd-error";
import type { Appointment } from "@/domain/enterprise/entities/appointment";
import type { AppointmentsRepository } from "../../repositories/appointment-repository";

interface FetchAppointmentsUseCaseRequest {
  page: number;
  pageSize: number;
  query: string;
}

type FetchAppointmentsUseCaseResponse = Either<
  null,
  {
    appointments: Appointment[];
  }
>;

export class FetchAppointmentsUseCase {
  constructor(private appointmentsRepository: AppointmentsRepository) {}

  async execute({
    page,
    pageSize,
    query,
  }: FetchAppointmentsUseCaseRequest): Promise<FetchAppointmentsUseCaseResponse> {
    const appointments = await this.appointmentsRepository.getAll(page, pageSize, query);

    return makeRight({
      appointments,
    });
  }
}
