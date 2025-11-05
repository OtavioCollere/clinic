import { describe, beforeEach, it, expect } from "vitest";
import { CreateProcedureUseCase } from "../create-procedure";
import { InMemoryUsersRepository } from "@/test/in-memory-repositories/in-memory-users-repository";
import { InMemoryProfessionalsRepository } from "@/test/in-memory-repositories/in-memory-professionals-repository";
import { InMemoryProceduresRepository } from "@/test/in-memory-repositories/in-memory-procedures-repository";
import { makeUser } from "@/test/factories/make-user";
import { makeProfessional } from "@/test/factories/make-professional";
import { isLeft, isRight, unwrapEither } from "@/core/either/either";
import { UserNotFoundError } from "@/core/errors/user-not-found-error";
import { ProfessionalNotFoundError } from "@/core/errors/professional-not-found-error";

describe("CreateProcedureUseCase unit tests", () => {
  let sut: CreateProcedureUseCase;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryProfessionalsRepository: InMemoryProfessionalsRepository;
  let inMemoryProceduresRepository: InMemoryProceduresRepository;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryProfessionalsRepository = new InMemoryProfessionalsRepository();
    inMemoryProceduresRepository = new InMemoryProceduresRepository();

    sut = new CreateProcedureUseCase(
      inMemoryProceduresRepository,
      inMemoryUsersRepository,
      inMemoryProfessionalsRepository,
    );
  });

  it("should create a new procedure", async () => {
    const user = makeUser({});
    inMemoryUsersRepository.items.push(user);

    const professional = makeProfessional({});
    inMemoryProfessionalsRepository.items.push(professional);

    const result = await sut.execute({
      clientId: user.id.toString(),
      professionalId: professional.id.toString(),
      name: "Botox Facial",
      product: "Toxina Botulínica",
      value: 800,
      description: "Aplicação de botox na testa e região dos olhos",
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      const { procedure } = unwrapEither(result);
      expect(procedure.name).toBe("Botox Facial");
      expect(inMemoryProceduresRepository.items).toHaveLength(1);
    }
  });

  it("should not create a procedure if user does not exist", async () => {
    const professional = makeProfessional({});
    inMemoryProfessionalsRepository.items.push(professional);

    const result = await sut.execute({
      clientId: "non-existing-id",
      professionalId: professional.id.toString(),
      name: "Peeling Químico",
      value: 500,
    });

    expect(isLeft(result)).toBe(true);
    expect(unwrapEither(result)).toBeInstanceOf(UserNotFoundError);
  });

  it("should not create a procedure if professional does not exist", async () => {
    const user = makeUser({});
    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      clientId: user.id.toString(),
      professionalId: "non-existing-id",
      name: "Peeling Químico",
      value: 500,
    });

    expect(isLeft(result)).toBe(true);
    expect(unwrapEither(result)).toBeInstanceOf(ProfessionalNotFoundError);
  });
});
