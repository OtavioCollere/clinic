import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { Optional } from "@/core/types/optional";

export interface ClientProps {
  userId: UniqueEntityID;
  address: string;
  phone: string;
  birthDate: Date;
  cpf: string;
  profession: string;
  emergencyPhone?: string;
  notes?: string;

  createdAt: Date;
  updatedAt?: Date;
}

export class Client extends Entity<ClientProps> {
  get userId() {
    return this.props.userId;
  }

  get address() {
    return this.props.address;
  }

  get phone() {
    return this.props.phone;
  }

  get birthDate() {
    return this.props.birthDate;
  }

  get cpf() {
    return this.props.cpf;
  }

  get profession() {
    return this.props.profession;
  }

  get emergencyPhone() {
    return this.props.emergencyPhone;
  }

  get notes() {
    return this.props.notes;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: Optional<ClientProps, "createdAt">, id?: UniqueEntityID) {
    const client = new Client(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return client;
  }
}
