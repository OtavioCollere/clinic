import { beforeEach, describe, expect, it } from "vitest";
import { CreateClientUseCase } from "../create-client";
import { InMemoryUsersRepository } from "@/test/in-memory-repositories/in-memory-users-repository";
import { InMemoryClientsRepository } from "@/test/in-memory-repositories/in-memory-clients-repository";
import { makeUser } from "@/test/factories/make-user";
import { isLeft, isRight, unwrapEither } from "@/core/either/either";
import { UserNotFoundError } from "@/core/errors/user-not-found-error";

describe("CreateClientUseCase unit tests", () => {
  let sut: CreateClientUseCase;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryClientsRepository: InMemoryClientsRepository;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryClientsRepository = new InMemoryClientsRepository();
    sut = new CreateClientUseCase(inMemoryClientsRepository, inMemoryUsersRepository);
  });

  it("should be able to register a new client", async () => {
    const user = makeUser({});
    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      clientId: user.id.toString(),
      address: "Rua Fake",
      phone: "41996335822",
      birthDate: new Date(2003, 9, 16),
      cpf: "08898972771",
      profession: "Dev",
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(inMemoryClientsRepository.items[0].cpf).toEqual("08898972771");
      expect(unwrapEither(result).client.clientId).toEqual(user.id);
    }
  });

  it("should not create a client with a non-existing user ID", async () => {
    const result = await sut.execute({
      clientId: "non-existing-id",
      address: "Rua Fake",
      phone: "41996335822",
      birthDate: new Date(2003, 9, 16),
      cpf: "08898972771",
      profession: "Dev",
    });

    expect(isLeft(result)).toBe(true);
    expect(unwrapEither(result)).toBeInstanceOf(UserNotFoundError);
  });

  it("should not create a client if another client already exists with the same CPF", async () => {
    const user = makeUser({});
    inMemoryUsersRepository.items.push(user);

    await sut.execute({
      clientId: user.id.toString(),
      address: "Rua 1",
      phone: "1111111111",
      birthDate: new Date(2003, 9, 16),
      cpf: "08898972771",
      profession: "Dev",
    });

    const result = await sut.execute({
      clientId: user.id.toString(),
      address: "Rua 2",
      phone: "2222222222",
      birthDate: new Date(2003, 9, 16),
      cpf: "08898972771", // duplicate
      profession: "Designer",
    });

    expect(isLeft(result)).toBe(true);
  });
});
