import { beforeEach, describe, expect, it } from "vitest";
import { GetProfessionalUseCase } from "../get-professional";
import { InMemoryProfessionalsRepository } from "@/test/in-memory-repositories/in-memory-professionals-repository";
import { makeProfessional } from "@/test/factories/make-professional";
import { makeUser } from "@/test/factories/make-user";
import { isRight, unwrapEither } from "@/core/either/either";

describe("GetProfessionalUseCase unit tests", () => {
  let sut: GetProfessionalUseCase;
  let inMemoryProfessionalsRepository: InMemoryProfessionalsRepository;

  beforeEach(() => {
    inMemoryProfessionalsRepository = new InMemoryProfessionalsRepository();
    sut = new GetProfessionalUseCase(inMemoryProfessionalsRepository);
  });

  it("should be able to get a professional by id", async () => {
    const professional = makeProfessional({
      licenseNumber: "9292",
    });

    inMemoryProfessionalsRepository.items.push(professional);

    const result = await sut.execute(professional.id.toString());

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).professional.licenseNumber).toEqual("9292");
    }
  });
});
