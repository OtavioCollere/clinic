import { describe, beforeEach, it, expect } from "vitest";
import { CreateAppointmentUseCase } from "../create-appointment";
import { InMemoryUsersRepository } from "@/test/in-memory-repositories/in-memory-users-repository";
import { InMemoryProfessionalsRepository } from "@/test/in-memory-repositories/in-memory-professionals-repository";
import { InMemoryAppointmentsRepository } from "@/test/in-memory-repositories/in-memory-appointments-repository";
import { isLeft, isRight, unwrapEither } from "@/core/either/either";
import { UserNotFoundError } from "@/core/errors/user-not-found-error";
import { ProfessionalNotFoundError } from "@/core/errors/professional-not-found-error";
import { makeUser } from "@/test/factories/make-user";
import { makeProfessional } from "@/test/factories/make-professional";
import { makeAppointment } from "@/test/factories/make-appointment";
import { duration } from "zod/v4/classic/iso.cjs";
import { InvalidDurationError } from "@/core/errors/invalid-duration-error";

describe("CreateAppointmentUseCase unit tests", () => {
  let sut: CreateAppointmentUseCase;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryProfessionalsRepository: InMemoryProfessionalsRepository;
  let inMemoryAppointmentsRepository: InMemoryAppointmentsRepository;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryProfessionalsRepository = new InMemoryProfessionalsRepository();
    inMemoryAppointmentsRepository = new InMemoryAppointmentsRepository();
    sut = new CreateAppointmentUseCase(
      inMemoryAppointmentsRepository,
      inMemoryUsersRepository,
      inMemoryProfessionalsRepository,
    );
  });

  it("should create a new appointment", async () => {
    const user = makeUser({});
    inMemoryUsersRepository.items.push(user);

    const professional = makeProfessional({});
    inMemoryProfessionalsRepository.items.push(professional);

    const result = await sut.execute({
      userId: user.id.toString(),
      professionalId: professional.id.toString(),
      name: "Consulta para botox",
      duration: 60,
      description: "Paciente renata está fazendo retorno após 15 dias",
      dateHour: new Date(),
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(inMemoryAppointmentsRepository.items[0].name).toEqual("Consulta para botox");
      expect(unwrapEither(result).appointment.userId.toString()).toEqual(user.id.toString());
    }
  });

  it("should not create a new appointment with an invalid user ID", async () => {
    const professional = makeProfessional({});
    inMemoryProfessionalsRepository.items.push(professional);

    const result = await sut.execute({
      userId: "non-existing-id",
      professionalId: professional.id.toString(),
      name: "Test Appointment",
      duration: 60,
      dateHour: new Date(),
    });

    expect(isLeft(result)).toBe(true);
    expect(unwrapEither(result)).toBeInstanceOf(UserNotFoundError);
  });

  it("should not create a new appointment with an invalid professional ID", async () => {
    const user = makeUser({});
    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      userId: user.id.toString(),
      professionalId: "non-existing-id",
      name: "Test Appointment",
      duration: 60,
      dateHour: new Date(),
    });

    expect(isLeft(result)).toBe(true);
    expect(unwrapEither(result)).toBeInstanceOf(ProfessionalNotFoundError);
  });

  it("should not create a new appointment with an invalid duration", async () => {
    const user = makeUser({});
    inMemoryUsersRepository.items.push(user);

    const professional = makeProfessional({});
    inMemoryProfessionalsRepository.items.push(professional);

    const appointment = makeAppointment({
      dateHour: new Date("2024-11-01T08:00:00"),
      duration: 60,
    });
    inMemoryAppointmentsRepository.items.push(appointment);

    const result = await sut.execute({
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
