import { describe, beforeEach, it, expect } from "vitest";
import { EditAnamnesisUseCase } from "../edit-anamnesis";
import { InMemoryAnamnesisRepository } from "@/test/in-memory-repositories/in-memory-anamnesis-repository";
import { makeAnamnesis } from "@/test/factories/make-anamnesis";
import { isLeft, isRight, unwrapEither } from "@/core/either/either";
import { AnamnesisNotFoundError } from "@/core/errors/anamnesis-not-found-error";

describe("EditAnamnesisUseCase unit tests", () => {
  let sut: EditAnamnesisUseCase;
  let inMemoryAnamnesisRepository: InMemoryAnamnesisRepository;

  beforeEach(() => {
    inMemoryAnamnesisRepository = new InMemoryAnamnesisRepository();
    sut = new EditAnamnesisUseCase(inMemoryAnamnesisRepository);
  });

  it("should be able to edit an anamnesis", async () => {
    const anamnesis = makeAnamnesis({
      smoker: false,
      hadPreviousAestheticTreatment: false,
    });
    inMemoryAnamnesisRepository.items.push(anamnesis);

    const result = await sut.execute({
      anamnesisId: anamnesis.id.toString(),
      smoker: true,
      hadPreviousAestheticTreatment: true,
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      const updated = unwrapEither(result).anamnesis;
      expect(updated).toBeDefined();
    }
  });

  it("should not edit a non-existing anamnesis", async () => {
    const result = await sut.execute({
      anamnesisId: "non-existing-id",
      smoker: true,
    });

    expect(isLeft(result)).toBe(true);
    expect(unwrapEither(result)).toBeInstanceOf(AnamnesisNotFoundError);
  });
});
