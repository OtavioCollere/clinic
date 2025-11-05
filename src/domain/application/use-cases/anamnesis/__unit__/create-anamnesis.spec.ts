import { describe, beforeEach, it, expect } from "vitest";
import { CreateAnamnesisUseCase } from "../create-anamnesis";
import { InMemoryUsersRepository } from "@/test/in-memory-repositories/in-memory-users-repository";
import { makeUser } from "@/test/factories/make-user";
import { isLeft, isRight, unwrapEither } from "@/core/either/either";
import { UserNotFoundError } from "@/core/errors/user-not-found-error";
import { InMemoryAnamnesisRepository } from "@/test/in-memory-repositories/in-memory-anamnesis-repository";

describe("CreateAnamnesisUseCase unit tests", () => {
  let sut: CreateAnamnesisUseCase;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryAnamnesisRepository: InMemoryAnamnesisRepository;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryAnamnesisRepository = new InMemoryAnamnesisRepository();
    sut = new CreateAnamnesisUseCase(inMemoryAnamnesisRepository, inMemoryUsersRepository);
  });

  it("should create a new anamnesis", async () => {
    const user = makeUser({});
    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      clientId: user.id.toString(),
      hadPreviousAestheticTreatment: false,
      botulinumToxin: false,
      filler: false,
      suspensionThreads: false,
      surgicalLift: false,
      chemicalPeeling: false,
      laser: false,
      exposedToHeatOrColdWork: false,
      smoker: false,
      circulatoryDisorder: false,
      epilepsy: false,
      regularMenstrualCycle: true,
      regularIntestinalFunction: true,
      cardiacAlterations: false,
      hormonalDisorder: false,
      hypoOrHypertension: false,
      renalDisorder: false,
      varicoseVeinsOrLesions: false,
      pregnant: false,
      underMedicalTreatment: false,
      usesMedication: false,
      allergy: false,
      lactoseIntolerance: false,
      diabetes: null,
      roacutan: false,
      recentSurgery: false,
      tumorOrPrecancerousLesion: false,
      skinProblems: false,
      orthopedicProblems: false,
      hasBodyOrFacialProsthesis: false,
      usingAcids: false,
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      const anamnesis = unwrapEither(result).anamnesis;
      expect(anamnesis.clientId.toString()).toEqual(user.id.toString());
      expect(inMemoryAnamnesisRepository.items).toHaveLength(1);
    }
  });

  it("should not create a new anamnesis with an invalid client ID", async () => {
    const result = await sut.execute({
      clientId: "non-existing-id",
      hadPreviousAestheticTreatment: false,
      botulinumToxin: false,
      filler: false,
      suspensionThreads: false,
      surgicalLift: false,
      chemicalPeeling: false,
      laser: false,
      exposedToHeatOrColdWork: false,
      smoker: false,
      circulatoryDisorder: false,
      epilepsy: false,
      regularMenstrualCycle: true,
      regularIntestinalFunction: true,
      cardiacAlterations: false,
      hormonalDisorder: false,
      hypoOrHypertension: false,
      renalDisorder: false,
      varicoseVeinsOrLesions: false,
      pregnant: false,
      underMedicalTreatment: false,
      usesMedication: false,
      allergy: false,
      lactoseIntolerance: false,
      diabetes: null,
      roacutan: false,
      recentSurgery: false,
      tumorOrPrecancerousLesion: false,
      skinProblems: false,
      orthopedicProblems: false,
      hasBodyOrFacialProsthesis: false,
      usingAcids: false,
    });

    expect(isLeft(result)).toBe(true);
    expect(unwrapEither(result)).toBeInstanceOf(UserNotFoundError);
  });
});
