import { AppModule } from "@/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma.service";
import { UserFactory } from "@/test/factories/make-user";
import { ProfessionalFactory } from "@/test/factories/make-professional";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import supertest from "supertest";
import { beforeAll, describe, expect, it } from "vitest";

describe("Get Professional (E2E)", () => {
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

  it("[GET] /professionals/:id", async () => {
    const user = await userFactory.makePrismaUser();
    const professional = await professionalFactory.makePrismaProfessional({
      clientId: user.id,
    });

    const response = await supertest(app.getHttpServer()).get(
      `/professionals/${professional.id.toString()}`,
    );

    expect(response.statusCode).toEqual(200);
    expect(response.body.professional.id).toEqual(professional.id.toString());
    expect(response.body.professional.licenseNumber).toEqual(professional.licenseNumber);
  });
});
