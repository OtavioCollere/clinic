import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryAppointmentsRepository } from "@/test/in-memory-repositories/in-memory-appointments-repository";
import { makeAppointment } from "@/test/factories/make-appointment";
import { isRight, unwrapEither } from "@/core/either/either";
import { FetchAppointmentsUseCase } from "../fetch-appointments";

describe("FetchAppointmentsUseCase unit tests", () => {
  let sut: FetchAppointmentsUseCase;
  let inMemoryAppointmentsRepository: InMemoryAppointmentsRepository;

  beforeEach(() => {
    inMemoryAppointmentsRepository = new InMemoryAppointmentsRepository();
    sut = new FetchAppointmentsUseCase(inMemoryAppointmentsRepository);
  });

  it("should be able to fetch appointments", async () => {
    for (let i = 1; i <= 10; i++) {
      const appointment = makeAppointment({
        name: `Consulta ${i}`,
      });
      inMemoryAppointmentsRepository.items.push(appointment);
    }

    const result = await sut.execute({
      page: 1,
      pageSize: 5,
      query: "",
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).appointments.length).toBe(5);
    }
  });

  it("should be able to fetch appointments with pagination and query", async () => {
    for (let i = 1; i <= 10; i++) {
      const appointment = makeAppointment({
        name: i <= 5 ? `Consulta Botox ${i}` : `Consulta Preenchimento ${i}`,
        description: i <= 5 ? "Tratamento botox" : "Tratamento preenchimento",
      });
      inMemoryAppointmentsRepository.items.push(appointment);
    }

    const result = await sut.execute({
      page: 1,
      pageSize: 3,
      query: "Botox",
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).appointments.length).toBe(3);
      expect(unwrapEither(result).appointments[0].name).toContain("Botox");
      expect(unwrapEither(result).appointments[1].name).toContain("Botox");
      expect(unwrapEither(result).appointments[2].name).toContain("Botox");
    }
  });
});
