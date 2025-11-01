import { beforeEach, describe, expect, it } from "vitest";
import { GetAppointmentUseCase } from "../get-appointments";
import { InMemoryAppointmentsRepository } from "@/test/in-memory-repositories/in-memory-appointments-repository";
import { makeAppointment } from "@/test/factories/make-appointment";
import { isRight, isLeft, unwrapEither } from "@/core/either/either";
import { AppointmentNotFoundError } from "@/core/errors/appointment-not-foundd-error";

describe("GetAppointmentUseCase unit tests", () => {
  let sut: GetAppointmentUseCase;
  let inMemoryAppointmentsRepository: InMemoryAppointmentsRepository;

  beforeEach(() => {
    inMemoryAppointmentsRepository = new InMemoryAppointmentsRepository();
    sut = new GetAppointmentUseCase(inMemoryAppointmentsRepository);
  });

  it("should be able to get an appointment by id", async () => {
    const appointment = makeAppointment({
      name: "Consulta de retorno",
    });

    inMemoryAppointmentsRepository.items.push(appointment);

    const result = await sut.execute({
      appointmentId: appointment.id.toString(),
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).appointment.name).toEqual("Consulta de retorno");
    }
  });

  it("should not be able to get an appointment with an invalid id", async () => {
    const result = await sut.execute({
      appointmentId: "non-existing-id",
    });

    expect(isLeft(result)).toBe(true);
    expect(unwrapEither(result)).toBeInstanceOf(AppointmentNotFoundError);
  });
});
