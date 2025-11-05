import { describe, beforeEach, it, expect } from "vitest";
import { EditProcedureUseCase } from "../edit-procedure";
import { InMemoryProceduresRepository } from "@/test/in-memory-repositories/in-memory-procedures-repository";
import { makeProcedure } from "@/test/factories/make-procedure";
import { isLeft, isRight, unwrapEither } from "@/core/either/either";
import { ProcedureNotFoundError } from "@/core/errors/procedure-not-found-error";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

describe("EditProcedureUseCase unit tests", () => {
  let sut: EditProcedureUseCase;
  let inMemoryProceduresRepository: InMemoryProceduresRepository;

  beforeEach(() => {
    inMemoryProceduresRepository = new InMemoryProceduresRepository();
    sut = new EditProcedureUseCase(inMemoryProceduresRepository);
  });

  it("should be able to edit a procedure", async () => {
    const procedure = makeProcedure({
      name: "Peeling",
      value: 400,
      description: "Peeling facial leve",
    });

    inMemoryProceduresRepository.items.push(procedure);

    const result = await sut.execute({
      procedureId: procedure.id.toString(),
      clientId: procedure.clientId.toString(),
      professionalId: procedure.professionalId.toString(),
      name: "Peeling Químico",
      product: "Ácido Mandélico",
      value: 550,
      description: "Peeling químico médio para rejuvenescimento",
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      const { procedure: updated } = unwrapEither(result);
      expect(updated.name).toBe("Peeling Químico");
      expect(updated.value).toBe(550);
      expect(updated.description).toContain("rejuvenescimento");
    }
  });

  it("should not be able to edit a non-existing procedure", async () => {
    const result = await sut.execute({
      procedureId: "invalid-id",
      clientId: new UniqueEntityID().toString(),
      professionalId: new UniqueEntityID().toString(),
      name: "Teste",
      value: 200,
    });

    expect(isLeft(result)).toBe(true);
    expect(unwrapEither(result)).toBeInstanceOf(ProcedureNotFoundError);
  });
});
