import { describe, beforeEach, it, expect } from "vitest";
import { InMemoryProceduresRepository } from "@/test/in-memory-repositories/in-memory-procedures-repository";
import { makeProcedure } from "@/test/factories/make-procedure";
import { isRight, unwrapEither } from "@/core/either/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { GetProceduresByClientIdUseCase } from "../get-procedures-by-client-id";

describe("GetProceduresByClientIdUseCase unit tests", () => {
  let sut: GetProceduresByClientIdUseCase;
  let inMemoryProceduresRepository: InMemoryProceduresRepository;

  beforeEach(() => {
    inMemoryProceduresRepository = new InMemoryProceduresRepository();
    sut = new GetProceduresByClientIdUseCase(inMemoryProceduresRepository);
  });

  it("should list all procedures by client ID", async () => {
    const clientId = new UniqueEntityID("client-001");

    const procedure1 = makeProcedure({ clientId });
    const procedure2 = makeProcedure({ clientId });
    const procedure3 = makeProcedure({ clientId: new UniqueEntityID("other-client") });

    inMemoryProceduresRepository.items.push(procedure1, procedure2, procedure3);

    const result = await sut.execute({
      clientId: clientId.toString(),
      page: 1,
      pageSize: 10,
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      const { procedures } = unwrapEither(result);
      expect(procedures).toHaveLength(2);
      expect(procedures.every((p) => p.clientId.toString() === clientId.toString())).toBe(true);
    }
  });
});
