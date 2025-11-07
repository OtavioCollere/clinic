import { makeLeft, makeRight, type Either } from "@/core/either/either";
import { Appointment } from "@/domain/enterprise/entities/appointment";
import { AppointmentsRepository } from "../../repositories/appointment-repository";
import { Injectable } from "@nestjs/common";

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

@Injectable()
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
