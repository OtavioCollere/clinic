import { AppModule } from "@/app.module";
import { PrismaService } from "@/infra/database/prisma.service";
import { UserFactory } from "@/test/factories/make-user";
import { ClientFactory } from "@/test/factories/make-client";
import { DatabaseModule } from "@/infra/database/database.module";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import supertest from "supertest";
import { beforeAll, describe, expect, it } from "vitest";

describe("Get Client (E2E)", () => {
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

  it("[GET] /clients/:id", async () => {
    const user = await userFactory.makePrismaUser({});
    const client = await clientFactory.makePrismaClient({ userId: user.id });

    const response = await supertest(app.getHttpServer()).get(`/clients/${client.id}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.client.cpf).toEqual(client.cpf);
  });
});
