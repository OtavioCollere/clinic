import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryClientsRepository } from "@/test/in-memory-repositories/in-memory-clients-repository";
import { makeClient } from "@/test/factories/make-client";
import { isLeft, isRight, unwrapEither } from "@/core/either/either";
import { ClientNotFoundError } from "@/core/errors/client-not-found-error";
import { GetClientUseCase } from "../get-client";

describe("GetClientUseCase unit tests", () => {
  let sut: GetClientUseCase;
  let inMemoryClientsRepository: InMemoryClientsRepository;

  beforeEach(() => {
    inMemoryClientsRepository = new InMemoryClientsRepository();
    sut = new GetClientUseCase(inMemoryClientsRepository);
  });

  it("should return an existing client by ID", async () => {
    const client = makeClient({});
    inMemoryClientsRepository.items.push(client);

    const result = await sut.execute({ clientId: client.id.toString() });

    expect(isRight(result)).toBeTruthy();

    if (isRight(result)) {
      const returnedClient = unwrapEither(result).client;
      expect(returnedClient.id.toString()).toEqual(client.id.toString());
      expect(returnedClient.cpf).toEqual(client.cpf);
    }
  });

  it("should return an error if client is not found", async () => {
    const result = await sut.execute({ clientId: "non-existing-id" });

    expect(isLeft(result)).toBe(true);
    expect(unwrapEither(result)).toBeInstanceOf(ClientNotFoundError);
  });
});
