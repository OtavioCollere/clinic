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

describe("Edit Appointment (E2E)", () => {
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

  it("[PUT] /appointment/edit", async () => {
    const user = await userFactory.makePrismaUser();
    const professional = await professionalFactory.makePrismaProfessional();
    const appointment = await appointmentFactory.makePrismaAppointment({
      clientId: user.id,
      professionalId: professional.id,
    });

    const response = await supertest(app.getHttpServer()).put("/appointment/edit").send({
      appointmentId: appointment.id.toString(),
      clientId: user.id.toString(),
      professionalId: professional.id.toString(),
      name: "Consulta atualizada",
      duration: 90,
      description: "Descrição atualizada",
      dateHour: new Date().toISOString(),
    });

    const updatedAppointment = await prisma.appointment.findUnique({
      where: { id: appointment.id.toString() },
    });

    expect(response.statusCode).toEqual(200);
    expect(updatedAppointment?.name).toEqual("Consulta atualizada");
    expect(updatedAppointment?.duration).toEqual(90);
  });
});
