import { AppModule } from "@/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma.service";
import { UserFactory } from "@/test/factories/make-user";
import { ProfessionalFactory } from "@/test/factories/make-professional";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import supertest from "supertest";
import { beforeAll, describe, expect, it } from "vitest";

describe("Create Professional (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, ProfessionalFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    userFactory = moduleRef.get(UserFactory);
    await app.init();
  });

  it("[POST] /professionals/create", async () => {
    const user = await userFactory.makePrismaUser();

    const response = await supertest(app.getHttpServer()).post("/professionals/create").send({
      clientId: user.id.toString(),
      type: "MEDICO",
      licenseNumber: "CRM123456",
      description: "Dermatologista",
    });

    const professional = await prisma.professional.findUnique({
      where: { licenseNumber: "CRM123456" },
    });

    expect(response.statusCode).toEqual(201);
    expect(professional).toBeDefined();
    expect(professional?.type).toEqual("MEDICO");
  });
});
