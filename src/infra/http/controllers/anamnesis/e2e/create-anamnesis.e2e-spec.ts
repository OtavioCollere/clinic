// test/e2e/anamnesis/create-anamnesis.e2e-spec.ts
import { AppModule } from "@/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma.service";
import { UserFactory } from "@/test/factories/make-user";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import supertest from "supertest";
import { beforeAll, describe, expect, it } from "vitest";

describe("Create Anamnesis (E2E)", () => {
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

  it("[POST] /anamnesis/create", async () => {
    const user = await userFactory.makePrismaUser({});

    const payload = {
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

    const res = await supertest(app.getHttpServer()).post("/anamnesis/create").send(payload);

    expect(res.statusCode).toBe(201);

    const onDb = await prisma.anamnesis.findFirst({
      where: { clientId: user.id.toString() },
    });
    expect(onDb).toBeDefined();
    expect(onDb?.clientId).toBe(user.id.toString());
  });
});
