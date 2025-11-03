import { beforeEach, describe, expect, it } from "vitest";
import { EditClientUseCase } from "../edit-client";
import { InMemoryClientsRepository } from "@/test/in-memory-repositories/in-memory-clients-repository";
import { InMemoryUsersRepository } from "@/test/in-memory-repositories/in-memory-users-repository";
import { makeUser } from "@/test/factories/make-user";
import { makeClient } from "@/test/factories/make-client";
import { isLeft, isRight, unwrapEither } from "@/core/either/either";
import { UserNotFoundError } from "@/core/errors/user-not-found-error";
import { ClientNotFoundError } from "@/core/errors/client-not-found-error";

describe("EditClientUseCase unit tests", () => {
  let sut: EditClientUseCase;
  let inMemoryClientsRepository: InMemoryClientsRepository;
  let inMemoryUsersRepository: InMemoryUsersRepository;

  beforeEach(() => {
    inMemoryClientsRepository = new InMemoryClientsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new EditClientUseCase(inMemoryClientsRepository, inMemoryUsersRepository);
  });

  it("should edit an existing client", async () => {
    const user = makeUser({});
    inMemoryUsersRepository.items.push(user);

    const client = makeClient({ userId: user.id });
    inMemoryClientsRepository.items.push(client);

    const result = await sut.execute({
      clientId: client.id.toString(),
      userId: user.id.toString(),
      address: "New Street, 123",
      phone: "99999-8888",
      birthDate: new Date(2003, 9, 16),
      cpf: "08898972771",
      profession: "Developer",
    });

    expect(isRight(result)).toBeTruthy();

    if (isRight(result)) {
      const updated = unwrapEither(result).client;
      expect(updated.address).toEqual("New Street, 123");
      expect(updated.updatedAt).not.toBeNull();
    }
  });

  it("should not edit a client with non-existing client ID", async () => {
    const user = makeUser({});
    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      clientId: "invalid-id",
      userId: user.id.toString(),
      address: "Rua Teste",
      phone: "11111111",
      birthDate: new Date(2003, 9, 16),
      cpf: "08898972771",
      profession: "Dev",
    });

    expect(isLeft(result)).toBe(true);
    expect(unwrapEither(result)).toBeInstanceOf(ClientNotFoundError);
  });

  it("should not edit a client with non-existing user ID", async () => {
    const client = makeClient({});
    inMemoryClientsRepository.items.push(client);

    const result = await sut.execute({
      clientId: client.id.toString(),
      userId: "invalid-user",
      address: "Rua Fake",
      phone: "99999999",
      birthDate: new Date(2003, 9, 16),
      cpf: "08898972771",
      profession: "Dev",
    });

    expect(isLeft(result)).toBe(true);
    expect(unwrapEither(result)).toBeInstanceOf(UserNotFoundError);
  });

  it("should not allow updating client with duplicated CPF", async () => {
    const user = makeUser({});
    inMemoryUsersRepository.items.push(user);

    const client1 = makeClient({ userId: user.id, cpf: "11111111111" });
    const client2 = makeClient({ userId: user.id, cpf: "22222222222" });

    inMemoryClientsRepository.items.push(client1, client2);

    const result = await sut.execute({
      clientId: client2.id.toString(),
      userId: user.id.toString(),
      address: "Rua X",
      phone: "44444444",
      birthDate: new Date(2003, 9, 16),
      cpf: "11111111111", // duplicated
      profession: "Eng",
    });

    expect(isLeft(result)).toBe(true);
  });
});
