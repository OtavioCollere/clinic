import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface AppointmentProps {
  userId: UniqueEntityID;
  professionalId: UniqueEntityID;
  name: string;
  description?: string;
  dateHour: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export class Appointment extends Entity<AppointmentProps> {
  get userId() {
    return this.props.userId;
  }

  get professionalId() {
    return this.props.professionalId;
  }

  get name() {
    return this.props.name;
  }

  get description() {
    return this.props.description;
  }

  get dateHour() {
    return this.props.dateHour;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: AppointmentProps, id?: UniqueEntityID) {
    const appointment = new Appointment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return appointment;
  }
}
