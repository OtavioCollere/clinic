import { describe, it, beforeEach, expect } from "vitest";
import { CreateProfessionalUseCase } from "../create-professional";
import { InMemoryUsersRepository } from "@/test/in-memory-repositories/in-memory-users-repository";
import { InMemoryProfessionalsRepository } from "@/test/in-memory-repositories/in-memory-professionals-repository";
import { isRight, isLeft, unwrapEither } from "@/core/either/either";
import { UserNotFoundError } from "@/core/errors/user-not-found-error";
import { LicenseNumberAlreadyExistsError } from "@/core/errors/license-number-already-exists-error";
import { makeUser } from "@/test/factories/make-user";

describe("CreateProfessionalUseCase unit tests", () => {
  let sut: CreateProfessionalUseCase;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryProfessionalsRepository: InMemoryProfessionalsRepository;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryProfessionalsRepository = new InMemoryProfessionalsRepository();
    sut = new CreateProfessionalUseCase(inMemoryProfessionalsRepository, inMemoryUsersRepository);
  });

  it("should create a new professional", async () => {
    const user = makeUser({});
    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      clientId: user.id.toString(),
      type: "MEDICO",
      licenseNumber: "8778",
      description: "Teste de descrição",
    });

    console.log(result);

    expect(isRight(result)).toBe(true);
    if (isRight(result)) {
      expect(inMemoryProfessionalsRepository.items.length).toBe(1);
      expect(unwrapEither(result).professional.clientId.toString()).toBe(user.id.toString());
      expect(unwrapEither(result).professional.licenseNumber).toEqual("8778");
    }
  });

  it("should not create a professional with an invalid user ID", async () => {
    const result = await sut.execute({
      clientId: "non-existing-id",
      type: "MEDICO",
      licenseNumber: "1234",
      description: "irrelevant",
    });

    expect(isLeft(result)).toBe(true);
    expect(unwrapEither(result)).toBeInstanceOf(UserNotFoundError);
  });

  it("should not create a professional with a duplicate license number", async () => {
    const user = makeUser({});
    inMemoryUsersRepository.items.push(user);

    const license = "DUP-001";

    const first = await sut.execute({
      clientId: user.id.toString(),
      type: "MEDICO",
      licenseNumber: license,
      description: "first",
    });
    expect(isRight(first)).toBe(true);

    const second = await sut.execute({
      clientId: user.id.toString(),
      type: "MEDICO",
      licenseNumber: license,
      description: "second",
    });

    expect(isLeft(second)).toBe(true);
    expect(unwrapEither(second)).toBeInstanceOf(LicenseNumberAlreadyExistsError);
  });
});
