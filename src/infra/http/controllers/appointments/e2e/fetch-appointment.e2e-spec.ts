import { AppModule } from "@/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma.service";
import { UserFactory } from "@/test/factories/make-user";
import { ProfessionalFactory } from "@/test/factories/make-professional";
import { AppointmentFactory } from "@/test/factories/make-appointment";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import supertest from "supertest";
import { beforeAll, describe, expect, it } from "vitest";

describe("Fetch Appointments (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userFactory: UserFactory;
  let professionalFactory: ProfessionalFactory;
  let appointmentFactory: AppointmentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, ProfessionalFactory, AppointmentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    userFactory = moduleRef.get(UserFactory);
    professionalFactory = moduleRef.get(ProfessionalFactory);
    appointmentFactory = moduleRef.get(AppointmentFactory);
    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  it("[GET] /appointment/fetch?page=1&pageSize=10&query=", async () => {
    const user = await userFactory.makePrismaUser();
    const professional = await professionalFactory.makePrismaProfessional();

    await Promise.all([
      appointmentFactory.makePrismaAppointment({
        clientId: user.id,
        professionalId: professional.id,
        name: "Consulta A",
      }),
      appointmentFactory.makePrismaAppointment({
        clientId: user.id,
        professionalId: professional.id,
        name: "Consulta B",
      }),
    ]);

    const response = await supertest(app.getHttpServer()).get(
      "/appointment/fetch?page=1&pageSize=10&query=",
    );

    expect(response.statusCode).toEqual(200);
    expect(Array.isArray(response.body.appointments)).toBeTruthy();
    expect(response.body.appointments.length).toBeGreaterThanOrEqual(2);
  });
});
