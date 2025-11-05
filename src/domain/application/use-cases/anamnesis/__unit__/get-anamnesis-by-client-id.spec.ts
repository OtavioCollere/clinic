import { describe, beforeEach, it, expect } from "vitest";
import { GetAnamnesisByClientIdUseCase } from "../get-anamnesis-by-client-id";
import { InMemoryAnamnesisRepository } from "@/test/in-memory-repositories/in-memory-anamnesis-repository";
import { makeAnamnesis } from "@/test/factories/make-anamnesis";
import { isRight, unwrapEither } from "@/core/either/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

describe("GetAnamnesisByClientIdUseCase unit tests", () => {
  let sut: GetAnamnesisByClientIdUseCase;
  let inMemoryAnamnesisRepository: InMemoryAnamnesisRepository;

  beforeEach(() => {
    inMemoryAnamnesisRepository = new InMemoryAnamnesisRepository();
    sut = new GetAnamnesisByClientIdUseCase(inMemoryAnamnesisRepository);
  });

  it("should get all anamneses by client ID", async () => {
    const clientId = new UniqueEntityID("client-123");

    const anamnesis1 = makeAnamnesis({ clientId });
    const anamnesis2 = makeAnamnesis({ clientId });
    const anamnesis3 = makeAnamnesis({ clientId: new UniqueEntityID("another-client") });

    inMemoryAnamnesisRepository.items.push(anamnesis1, anamnesis2, anamnesis3);

    const result = await sut.execute({ clientId: clientId.toString() });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      const { anamneses } = unwrapEither(result);
      expect(anamneses).toHaveLength(2);
      expect(anamneses.every((a) => a.clientId.toString() === clientId.toString())).toBe(true);
    }
  });
});
