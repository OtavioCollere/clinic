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

  async findBetweenDates(startTime: Date, endTime: Date): Promise<Appointment | null> {
    const appointment = this.items.find((item) => {
      const itemStart = item.dateHour;
      const itemEnd = new Date(itemStart.getTime() + item.duration * 60 * 1000);

      // Check if there's an overlap
      return (
        (itemStart >= startTime && itemStart < endTime) ||
        (itemEnd > startTime && itemEnd <= endTime) ||
        (itemStart <= startTime && itemEnd >= endTime)
      );
    });

    return appointment || null;
  }

  async getAll(page: number, pageSize: number, query?: string): Promise<Appointment[]> {
    let results = this.items;
    if (query) {
      results = results.filter((item) => {
        return item.name.includes(query) || (item.description && item.description.includes(query));
      });
    }
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return results.slice(start, end);
  }
}
