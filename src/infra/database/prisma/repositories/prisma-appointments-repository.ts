// src/infra/database/prisma/repositories/prisma-appointments-repository.ts

import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { AppointmentsRepository } from "@/domain/application/repositories/appointment-repository";
import { Appointment } from "@/domain/enterprise/entities/appointment";
import { PrismaAppointmentMapper } from "../mappers/prisma-appointment-mapper";

@Injectable()
export class PrismaAppointmentsRepository implements AppointmentsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Appointment | null> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) return null;

    return PrismaAppointmentMapper.toDomain(appointment);
  }

  async create(appointment: Appointment): Promise<Appointment> {
    const data = PrismaAppointmentMapper.toPrisma(appointment);

    await this.prisma.appointment.create({
      data,
    });

    return appointment;
  }

  async save(appointment: Appointment): Promise<Appointment> {
    const data = PrismaAppointmentMapper.toPrisma(appointment);

    await this.prisma.appointment.update({
      where: { id: data.id },
      data,
    });

    return appointment;
  }

  async findByProfessionalId(professionalId: string): Promise<Appointment[]> {
    const appointments = await this.prisma.appointment.findMany({
      where: { professionalId },
      orderBy: { dateHour: "asc" },
    });

    return appointments.map(PrismaAppointmentMapper.toDomain);
  }

  async findBetweenDates(startTime: Date, endTime: Date): Promise<Appointment | null> {
    const appointment = await this.prisma.appointment.findFirst({
      where: {
        OR: [
          {
            dateHour: {
              gte: startTime,
              lt: endTime,
            },
          },
          {
            dateHour: {
              lte: startTime,
            },
            // Calcula o fim: dateHour + duration (em minutos)
            // Prisma não suporta cálculo, então buscamos todos e filtramos no app
          },
        ],
      },
    });

    if (!appointment) return null;

    const domain = PrismaAppointmentMapper.toDomain(appointment);
    const appointmentEnd = new Date(domain.dateHour.getTime() + domain.duration * 60 * 1000);

    const hasOverlap =
      (domain.dateHour >= startTime && domain.dateHour < endTime) ||
      (appointmentEnd > startTime && appointmentEnd <= endTime) ||
      (domain.dateHour <= startTime && appointmentEnd >= endTime);

    return hasOverlap ? domain : null;
  }

  async getAll(page: number, pageSize: number, query?: string): Promise<Appointment[]> {
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ];
    }

    const appointments = await this.prisma.appointment.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { dateHour: "desc" },
    });

    return appointments.map(PrismaAppointmentMapper.toDomain);
  }
}
