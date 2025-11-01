import { describe, beforeEach, it, expect } from "vitest";
import { EditAppointmentUseCase } from "../edit-appointment";
import { InMemoryUsersRepository } from "@/test/in-memory-repositories/in-memory-users-repository";
import { InMemoryProfessionalsRepository } from "@/test/in-memory-repositories/in-memory-professionals-repository";
import { InMemoryAppointmentsRepository } from "@/test/in-memory-repositories/in-memory-appointments-repository";
import { isLeft, isRight, unwrapEither } from "@/core/either/either";
import { UserNotFoundError } from "@/core/errors/user-not-found-error";
import { ProfessionalNotFoundError } from "@/core/errors/professional-not-found-error";
import { AppointmentNotFoundError } from "@/core/errors/appointment-not-foundd-error";
import { InvalidDurationError } from "@/core/errors/invalid-duration-error";
import { makeUser } from "@/test/factories/make-user";
import { makeProfessional } from "@/test/factories/make-professional";
import { makeAppointment } from "@/test/factories/make-appointment";

describe("EditAppointmentUseCase unit tests", () => {
  let sut: EditAppointmentUseCase;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryProfessionalsRepository: InMemoryProfessionalsRepository;
  let inMemoryAppointmentsRepository: InMemoryAppointmentsRepository;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryProfessionalsRepository = new InMemoryProfessionalsRepository();
    inMemoryAppointmentsRepository = new InMemoryAppointmentsRepository();
    sut = new EditAppointmentUseCase(
      inMemoryAppointmentsRepository,
      inMemoryUsersRepository,
      inMemoryProfessionalsRepository,
    );
  });

  it("should be able to edit an appointment", async () => {
    const user = makeUser({});
    inMemoryUsersRepository.items.push(user);

    const professional = makeProfessional({});
    inMemoryProfessionalsRepository.items.push(professional);

    const appointment = makeAppointment({
      userId: user.id,
      professionalId: professional.id,
      name: "Consulta inicial",
      duration: 30,
    });
    inMemoryAppointmentsRepository.items.push(appointment);

    const result = await sut.execute({
      appointmentId: appointment.id.toString(),
      userId: user.id.toString(),
      professionalId: professional.id.toString(),
      name: "Consulta para botox",
      duration: 60,
      description: "Paciente renata está fazendo retorno após 15 dias",
      dateHour: new Date("2024-11-02T10:00:00"),
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).appointment.name).toEqual("Consulta para botox");
      expect(unwrapEither(result).appointment.duration).toEqual(60);
      expect(unwrapEither(result).appointment.description).toEqual(
        "Paciente renata está fazendo retorno após 15 dias",
      );
      expect(inMemoryAppointmentsRepository.items[0].name).toEqual("Consulta para botox");
    }
  });

  it("should not be able to edit an appointment with an invalid appointment ID", async () => {
    const user = makeUser({});
    inMemoryUsersRepository.items.push(user);

    const professional = makeProfessional({});
    inMemoryProfessionalsRepository.items.push(professional);

    const result = await sut.execute({
      appointmentId: "non-existing-id",
      userId: user.id.toString(),
      professionalId: professional.id.toString(),
      name: "Test Appointment",
      duration: 60,
      dateHour: new Date(),
    });

    expect(isLeft(result)).toBe(true);
    expect(unwrapEither(result)).toBeInstanceOf(AppointmentNotFoundError);
  });

  it("should not be able to edit an appointment with an invalid user ID", async () => {
    const user = makeUser({});
    inMemoryUsersRepository.items.push(user);

    const professional = makeProfessional({});
    inMemoryProfessionalsRepository.items.push(professional);

    const appointment = makeAppointment({
      userId: user.id,
      professionalId: professional.id,
    });
    inMemoryAppointmentsRepository.items.push(appointment);

    const result = await sut.execute({
      appointmentId: appointment.id.toString(),
      userId: "non-existing-id",
      professionalId: professional.id.toString(),
      name: "Test Appointment",
      duration: 60,
      dateHour: new Date(),
    });

    expect(isLeft(result)).toBe(true);
    expect(unwrapEither(result)).toBeInstanceOf(UserNotFoundError);
  });

  it("should not be able to edit an appointment with an invalid professional ID", async () => {
    const user = makeUser({});
    inMemoryUsersRepository.items.push(user);

    const professional = makeProfessional({});
    inMemoryProfessionalsRepository.items.push(professional);

    const appointment = makeAppointment({
      userId: user.id,
      professionalId: professional.id,
    });
    inMemoryAppointmentsRepository.items.push(appointment);

    const result = await sut.execute({
      appointmentId: appointment.id.toString(),
      userId: user.id.toString(),
      professionalId: "non-existing-id",
      name: "Test Appointment",
      duration: 60,
      dateHour: new Date(),
    });

    expect(isLeft(result)).toBe(true);
    expect(unwrapEither(result)).toBeInstanceOf(ProfessionalNotFoundError);
  });

  it("should not be able to edit an appointment with an invalid duration", async () => {
    const user = makeUser({});
    inMemoryUsersRepository.items.push(user);

    const professional = makeProfessional({});
    inMemoryProfessionalsRepository.items.push(professional);

    const existingAppointment = makeAppointment({
      dateHour: new Date("2024-11-01T08:00:00"),
      duration: 60,
    });
    inMemoryAppointmentsRepository.items.push(existingAppointment);

    const appointment = makeAppointment({
      userId: user.id,
      professionalId: professional.id,
      dateHour: new Date("2024-11-01T10:00:00"),
    });
    inMemoryAppointmentsRepository.items.push(appointment);

    const result = await sut.execute({
      appointmentId: appointment.id.toString(),
      userId: user.id.toString(),
      professionalId: professional.id.toString(),
      name: "Test Appointment",
      duration: 60,
      dateHour: new Date("2024-11-01T08:30:00"),
    });

    expect(isLeft(result)).toBe(true);
    expect(unwrapEither(result)).toBeInstanceOf(InvalidDurationError);
  });
});
