import { makeLeft, makeRight, type Either } from "@/core/either/either";
import { Appointment } from "@/domain/enterprise/entities/appointment";
import type { AppointmentsRepository } from "../../repositories/appointment-repository";
import type { UsersRepository } from "../../repositories/users-repository";
import type { ProfessionalsRepository } from "../../repositories/professionals-repository";
import { UserNotFoundError } from "@/core/errors/user-not-found-error";
import { ProfessionalNotFoundError } from "@/core/errors/professional-not-found-error";
import { InvalidDurationError } from "@/core/errors/invalid-duration-error";
import { AppointmentNotFoundError } from "@/core/errors/appointment-not-foundd-error";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface EditAppointmentUseCaseRequest {
  appointmentId: string;
  clientId: string;
  professionalId: string;
  name: string;
  duration: number;
  description?: string;
  dateHour: Date;
}

type EditAppointmentUseCaseResponse = Either<
  AppointmentNotFoundError | UserNotFoundError | ProfessionalNotFoundError | InvalidDurationError,
  {
    appointment: Appointment;
  }
>;

export class EditAppointmentUseCase {
  constructor(
    private appointmentsRepository: AppointmentsRepository,
    private usersRepository: UsersRepository,
    private professionalsRepository: ProfessionalsRepository,
  ) {}

  async execute({
    appointmentId,
    clientId,
    professionalId,
    name,
    duration,
    description,
    dateHour,
  }: EditAppointmentUseCaseRequest): Promise<EditAppointmentUseCaseResponse> {
    const appointment = await this.appointmentsRepository.findById(appointmentId);

    if (!appointment) {
      return makeLeft(new AppointmentNotFoundError());
    }

    const user = await this.usersRepository.findById(clientId);

    if (!user) {
      return makeLeft(new UserNotFoundError());
    }

    const professional = await this.professionalsRepository.findById(professionalId);

    if (!professional) {
      return makeLeft(new ProfessionalNotFoundError());
    }

    const startTime = dateHour;
    const endTime = new Date(dateHour.getTime() + duration * 60 * 1000);

    const conflictingAppointment = await this.appointmentsRepository.findBetweenDates(
      startTime,
      endTime,
    );

    if (conflictingAppointment && conflictingAppointment.id.toString() !== appointmentId) {
      return makeLeft(new InvalidDurationError());
    }

    const updatedAppointment = Appointment.create(
      {
        clientId: new UniqueEntityID(clientId),
        professionalId: new UniqueEntityID(professionalId),
        name,
        duration,
        description,
        dateHour,
        createdAt: appointment.createdAt,
        updatedAt: new Date(),
      },
      appointment.id,
    );

    await this.appointmentsRepository.save(updatedAppointment);

    return makeRight({ appointment: updatedAppointment });
  }
}
