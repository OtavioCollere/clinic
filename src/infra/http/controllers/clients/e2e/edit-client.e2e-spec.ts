import { AppModule } from "@/app.module";
import { PrismaService } from "@/infra/database/prisma.service";
import { UserFactory } from "@/test/factories/make-user";
import { ClientFactory } from "@/test/factories/make-client";
import { DatabaseModule } from "@/infra/database/database.module";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import supertest from "supertest";
import { beforeAll, describe, expect, it } from "vitest";

describe("Edit Client (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let clientFactory: ClientFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, ClientFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);
    clientFactory = moduleRef.get(ClientFactory);
    prisma = moduleRef.get(PrismaService);
    await app.init();
  });

  it("[PATCH] /clients/edit/:id", async () => {
    const user = await userFactory.makePrismaUser({});
    const client = await clientFactory.makePrismaClient({ clientId: user.id });

    const response = await supertest(app.getHttpServer()).patch(`/clients/edit`).send({
      clientId: client.id.toString(),
      clientId: user.id.toString(),
      address: "Rua Nova 123",
      phone: "41999998888",
      birthDate: "2003-10-16T00:00:00.000Z",
      cpf: "09982792934",
      profession: "Senior Developer",
    });

    const updated = await prisma.client.findUnique({
      where: { id: client.id.toString() },
    });

    expect(response.statusCode).toEqual(200);
    expect(updated?.address).toEqual("Rua Nova 123");
  });
});
