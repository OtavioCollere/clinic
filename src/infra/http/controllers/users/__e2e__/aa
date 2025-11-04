import { AppModule } from "@/app.module";
import { unwrapEither } from "@/core/either/either";
import { PrismaService } from "@/infra/database/prisma.service";
import { DatabaseModule } from "@faker-js/faker/.";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import supertest from "supertest";
import { beforeAll, describe, expect, it } from "vitest";

describe("Register  (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  it("[POST] /users - CreateUser", async () => {
    const result = await supertest(app.getHttpServer()).post("/users/create").send({
      name: "Otavio",
      email: "otavio@gmail.com",
      password: "otavio123",
      role: "USER",
    });

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: "otavio@gmail.com",
      },
    });
    expect(result.statusCode).toBe(201);
    expect(userOnDatabase).toBeDefined();
  });
});
