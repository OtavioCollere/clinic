import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Appointment, type AppointmentProps } from "@/domain/enterprise/entities/appointment";
import type { PrismaService } from "@/infra/database/prisma.service";
import { PrismaAppointmentMapper } from "@/infra/database/prisma/mappers/prisma-appointment-mapper";
import { Injectable } from "@nestjs/common";

export function makeAppointment(override: Partial<AppointmentProps>, id?: UniqueEntityID) {
  const appointment = Appointment.create(
    {
      userId: new UniqueEntityID(),
      professionalId: new UniqueEntityID(),
      name: "Test Appointment",
      description: "Test description",
      dateHour: new Date(),
      duration: 60,
      ...override,
    },
    id,
  );
  return appointment;
}

@Injectable()
export class AppointmentFactory {
  constructor(private prismaService: PrismaService) {}

  async makePrismaAppointment(data: Partial<AppointmentProps> = {}): Promise<Appointment> {
    const appointment = makeAppointment(data);

    await this.prismaService.appointment.create({
      data: PrismaAppointmentMapper.toPrisma(appointment),
    });

    return appointment;
  }
}
