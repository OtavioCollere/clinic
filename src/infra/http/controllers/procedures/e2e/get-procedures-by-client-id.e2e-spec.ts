import { AppModule } from "@/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma.service";
import { UserFactory } from "@/test/factories/make-user";
import { ProfessionalFactory } from "@/test/factories/make-professional";
import { ProcedureFactory } from "@/test/factories/make-procedure";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import supertest from "supertest";
import { beforeAll, describe, expect, it } from "vitest";

describe("Get Procedures By Client ID (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let professionalFactory: ProfessionalFactory;
  let procedureFactory: ProcedureFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, ProfessionalFactory, ProcedureFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);
    professionalFactory = moduleRef.get(ProfessionalFactory);
    procedureFactory = moduleRef.get(ProcedureFactory);
    await app.init();
  });

  it("[GET] /procedure/client/:clientId", async () => {
    const user = await userFactory.makePrismaUser({});
    const professional = await professionalFactory.makePrismaProfessional({});
    await procedureFactory.makePrismaProcedure({
      clientId: user.id,
      professionalId: professional.id,
    });

    const response = await supertest(app.getHttpServer()).get(`/procedure/client/${user.id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.procedures).toHaveLength(1);
  });
});
