// test/e2e/anamnesis/get-anamnesis-by-client-id.e2e-spec.ts
import { AppModule } from "@/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma.service";
import { UserFactory } from "@/test/factories/make-user";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import supertest from "supertest";
import { beforeAll, describe, expect, it } from "vitest";

describe("Get Anamnesis by Client ID (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);
    await app.init();
  });

  it("[GET] /anamnesis/client/:clientId", async () => {
    const user = await userFactory.makePrismaUser({});

    // cria duas anamnese para o cliente
    const basePayload = {
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
    };

    await supertest(app.getHttpServer()).post("/anamnesis/create").send(basePayload);
    await supertest(app.getHttpServer()).post("/anamnesis/create").send(basePayload);

    const res = await supertest(app.getHttpServer()).get(`/anamnesis/client/${user.id}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.anamneses)).toBe(true);
    expect(res.body.anamneses.length).toBeGreaterThanOrEqual(2);
    expect(res.body.anamneses.every((a: any) => a.clientId === user.id.toString())).toBe(true);
  });
});
