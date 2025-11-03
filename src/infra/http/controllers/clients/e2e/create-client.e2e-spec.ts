import { AppModule } from "@/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma.service";
import { UserFactory } from "@/test/factories/make-user";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import supertest from "supertest";
import { beforeAll, describe, expect, it } from "vitest";

describe("Register  (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  it("[POST] /clients/create", async () => {
    const user = await userFactory.makePrismaUser({});

    const result = await supertest(app.getHttpServer()).post("/clients/create").send({
      userId: user.id,
      address: "Rua XYZ",
      phone: "41996335828",
      birthDate: "2003-10-16T00:00:00.000Z",
      cpf: "09982792934",
      profession: "Desenvolvedor PL",
    });

    const clientOnDatabase = await prisma.client.findUnique({
      where: {
        cpf: "09982792934",
      },
    });

    expect(result.statusCode).toEqual(201);
    expect(clientOnDatabase).toBeDefined();
  });
});
