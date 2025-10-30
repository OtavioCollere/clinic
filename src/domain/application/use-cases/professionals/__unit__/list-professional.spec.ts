import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryProfessionalsRepository } from "@/test/in-memory-repositories/in-memory-professionals-repository";
import { makeProfessional } from "@/test/factories/make-professional";
import { isRight, unwrapEither } from "@/core/either/either";
import { ListProfessionalUseCase } from "../list-professional";

describe("ListProfessionalUseCase unit tests", () => {
  let sut: ListProfessionalUseCase;
  let inMemoryProfessionalsRepository: InMemoryProfessionalsRepository;

  beforeEach(() => {
    inMemoryProfessionalsRepository = new InMemoryProfessionalsRepository();
    sut = new ListProfessionalUseCase(inMemoryProfessionalsRepository);
  });

  it("should be able to list professionals", async () => {
    for (let i = 1; i <= 10; i++) {
      let professional = makeProfessional({
        description: "`PROFESSIONAL ${i}`",
      });
      inMemoryProfessionalsRepository.items.push(professional);
    }

    const result = await sut.execute({
      page: 1,
      pageSize: 5,
      query: "",
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).professionals.length).toBe(5);
    }
  });
});
