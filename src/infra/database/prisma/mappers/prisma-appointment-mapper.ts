// src/infra/database/prisma/mappers/prisma-appointment-mapper.ts

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Appointment } from "@/domain/enterprise/entities/appointment";
import { Appointment as PrismaAppointment } from "@/generated/client";

export class PrismaAppointmentMapper {
  static toDomain(raw: PrismaAppointment): Appointment {
    return Appointment.create(
      {
        userId: new UniqueEntityID(raw.userId),
        professionalId: new UniqueEntityID(raw.professionalId),
        name: raw.name,
        description: raw.description ?? undefined,
        dateHour: raw.dateHour,
        duration: raw.duration,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(appointment: Appointment): PrismaAppointment {
    return {
      id: appointment.id.toString(),
      userId: appointment.userId.toString(),
      professionalId: appointment.professionalId.toString(),
      name: appointment.name,
      description: appointment.description ?? null,
      dateHour: appointment.dateHour,
      duration: appointment.duration,
      createdAt: appointment.createdAt ?? new Date(),
      updatedAt: appointment.updatedAt ?? new Date(),
    };
  }
}
