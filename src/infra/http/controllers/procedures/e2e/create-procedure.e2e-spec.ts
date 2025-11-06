import { AppModule } from "@/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma.service";
import { UserFactory } from "@/test/factories/make-user";
import { ProfessionalFactory } from "@/test/factories/make-professional";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import supertest from "supertest";
import { beforeAll, describe, expect, it } from "vitest";

describe("Create Procedure (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let professionalFactory: ProfessionalFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, ProfessionalFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);
    professionalFactory = moduleRef.get(ProfessionalFactory);

    await app.init();
  });

  it("[POST] /procedure/create", async () => {
    const user = await userFactory.makePrismaUser({});
    const professional = await professionalFactory.makePrismaProfessional({});

    const response = await supertest(app.getHttpServer()).post("/procedure/create").send({
      clientId: user.id.toString(),
      professionalId: professional.id.toString(),
      name: "Limpeza de pele",
      product: "Sabonete neutro e ácido mandélico",
      value: 250,
      description: "Limpeza completa com hidratação",
    });

    expect(response.statusCode).toBe(201);

    const onDb = await prisma.procedure.findFirst({
      where: { name: "Limpeza de pele" },
    });
    expect(onDb).toBeDefined();
    expect(onDb?.value).toBe(250);
  });
});
