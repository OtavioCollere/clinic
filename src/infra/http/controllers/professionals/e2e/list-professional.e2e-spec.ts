import { AppModule } from "@/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma.service";
import { UserFactory } from "@/test/factories/make-user";
import { ProfessionalFactory } from "@/test/factories/make-professional";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import supertest from "supertest";
import { beforeAll, describe, expect, it } from "vitest";

describe("List Professionals (E2E)", () => {
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
    userFactory = moduleRef.get(UserFactory);
    professionalFactory = moduleRef.get(ProfessionalFactory);
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  it("[GET] /professionals/fetch?page=1&pageSize=10&query=", async () => {
    const user = await userFactory.makePrismaUser();

    await Promise.all([
      professionalFactory.makePrismaProfessional({
        clientId: user.id,
        licenseNumber: "CRM1000",
        type: "MEDICO",
      }),
      professionalFactory.makePrismaProfessional({
        clientId: user.id,
        licenseNumber: "CRM2000",
        type: "ODONTO",
      }),
    ]);

    const response = await supertest(app.getHttpServer()).get(
      "/professionals/fetch?page=1&pageSize=10&query=",
    );

    expect(response.statusCode).toEqual(200);
    expect(Array.isArray(response.body.professionals)).toBeTruthy();
    expect(response.body.professionals.length).toBeGreaterThanOrEqual(2);
  });
});
