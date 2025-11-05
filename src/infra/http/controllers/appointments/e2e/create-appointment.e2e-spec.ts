import { AppModule } from "@/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma.service";
import { ProfessionalFactory } from "@/test/factories/make-professional";
import { UserFactory } from "@/test/factories/make-user";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import supertest from "supertest";
import { beforeAll, describe, expect, it } from "vitest";

describe("Create appointment  (E2E)", () => {
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

  it("[POST] /appointment/create", async () => {
    const user = await userFactory.makePrismaUser();

    const userTwo = await userFactory.makePrismaUser();
    const professional = await professionalFactory.makePrismaProfessional();

    const result = await supertest(app.getHttpServer()).post("/appointment/create").send({
      clientId: user.id.toString(),
      professionalId: professional.id.toString(),
      name: "Consulta para procedimentos",
      duration: 60,
      description: "some description",
      dateHour: new Date(),
    });

    expect(result.statusCode).toBe(201);
  });
});
