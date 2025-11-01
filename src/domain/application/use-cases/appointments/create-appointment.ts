import { makeLeft, makeRight, type Either } from "@/core/either/either";
import { Appointment } from "@/domain/enterprise/entities/appointment";
import type { AppointmentsRepository } from "../../repositories/appointment-repository";
import type { UsersRepository } from "../../repositories/users-repository";
import type { ProfessionalsRepository } from "../../repositories/professionals-repository";
import { UserNotFoundError } from "@/core/errors/user-not-found-error";
import { ProfessionalNotFoundError } from "@/core/errors/professional-not-found-error";
import { InvalidDurationError } from "@/core/errors/invalid-duration-error";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface CreateAppointmentUseCaseRequest {
  userId: string;
  professionalId: string;
  name: string;
  duration: number;
  description?: string;
  dateHour: Date;
}

type CreateAppointmentUseCaseResponse = Either<
  UserNotFoundError | ProfessionalNotFoundError | InvalidDurationError,
  {
    appointment: Appointment;
  }
>;

export class CreateAppointmentUseCase {
  constructor(
    private appointmentsRepository: AppointmentsRepository,
    private usersRepository: UsersRepository,
    private professionalsRepository: ProfessionalsRepository,
  ) {}

  async execute({
    userId,
    professionalId,
    name,
    duration,
    description,
    dateHour,
  }: CreateAppointmentUseCaseRequest): Promise<CreateAppointmentUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return makeLeft(new UserNotFoundError());
    }

    const professional = await this.professionalsRepository.findById(professionalId);

    if (!professional) {
      return makeLeft(new ProfessionalNotFoundError());
    }

    const startTime = dateHour;
    const endTime = new Date(dateHour.getTime() + duration * 60 * 1000);

    const isNotValidDuration = await this.appointmentsRepository.findBetweenDates(
      startTime,
      endTime,
    );

    if (isNotValidDuration) {
      return makeLeft(new InvalidDurationError());
    }

    const appointment = Appointment.create({
      userId: new UniqueEntityID(userId),
      professionalId: new UniqueEntityID(professionalId),
      name,
      duration,
      description,
      dateHour,
    });

    await this.appointmentsRepository.create(appointment);

    return makeRight({ appointment });
  }
}
