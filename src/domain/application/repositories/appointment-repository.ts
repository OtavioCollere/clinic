import type { Appointment } from "@/domain/enterprise/entities/appointment";
import type { Professional } from "@/domain/enterprise/entities/professional";
import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class AppointmentsRepository {
  abstract findById(id: string): Promise<Appointment | null>;
  abstract create(appointment: Appointment): Promise<Appointment>;
  abstract findByProfessionalId(professionalId: string): Promise<Appointment[]>;
  abstract save(appointment: Appointment): Promise<Appointment>;
}
