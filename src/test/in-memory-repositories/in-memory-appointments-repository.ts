import { AppointmentsRepository } from "@/domain/application/repositories/appointment-repository";
import { Appointment } from "@/domain/enterprise/entities/appointment";

export class InMemoryAppointmentsRepository implements AppointmentsRepository {
  public items: Appointment[] = [];

  async findById(id: string): Promise<Appointment | null> {
    const appointment = this.items.find((item) => item.id.toString() === id);
    return appointment || null;
  }

  async create(appointment: Appointment): Promise<Appointment> {
    this.items.push(appointment);
    return appointment;
  }

  async findByProfessionalId(professionalId: string): Promise<Appointment[]> {
    const appointments = this.items.filter(
      (item) => item.professionalId.toString() === professionalId,
    );

    return appointments;
  }

  async save(appointment: Appointment): Promise<Appointment> {
    const index = this.items.findIndex(
      (item) => (item as any).id.toString() === (appointment as any).id.toString(),
    );
    if (index >= 0) {
      this.items[index] = appointment;
    } else {
      this.items.push(appointment);
    }
    return appointment;
  }
}
