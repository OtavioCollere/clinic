import { describe, beforeEach, it, expect } from "vitest";
import { GetProceduresByProfessionalIdUseCase } from "../get-procedures-by-professional-id";
import { InMemoryProceduresRepository } from "@/test/in-memory-repositories/in-memory-procedures-repository";
import { makeProcedure } from "@/test/factories/make-procedure";
import { isRight, unwrapEither } from "@/core/either/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

describe("GetProceduresByProfessionalIdUseCase unit tests", () => {
  let sut: GetProceduresByProfessionalIdUseCase;
  let inMemoryProceduresRepository: InMemoryProceduresRepository;

  beforeEach(() => {
    inMemoryProceduresRepository = new InMemoryProceduresRepository();
    sut = new GetProceduresByProfessionalIdUseCase(inMemoryProceduresRepository);
  });

  it("should list all procedures by professional ID", async () => {
    const professionalId = new UniqueEntityID("pro-123");

    const procedure1 = makeProcedure({ professionalId });
    const procedure2 = makeProcedure({ professionalId });
    const procedure3 = makeProcedure({ professionalId: new UniqueEntityID("pro-999") });

    inMemoryProceduresRepository.items.push(procedure1, procedure2, procedure3);

    const result = await sut.execute({
      professionalId: professionalId.toString(),
      page: 1,
      pageSize: 10,
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      const { procedures } = unwrapEither(result);
      expect(procedures).toHaveLength(2);
      expect(
        procedures.every((p) => p.professionalId.toString() === professionalId.toString()),
      ).toBe(true);
    }
  });
});
