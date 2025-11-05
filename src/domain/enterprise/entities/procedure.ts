import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { Optional } from "@/core/types/optional";

export interface ProcedureProps {
  clientId: UniqueEntityID;
  professionalId: UniqueEntityID;
  name: string;
  product?: string;
  value: number;
  description?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class Procedure extends Entity<ProcedureProps> {
  get clientId() {
    return this.props.clientId;
  }

  get professionalId() {
    return this.props.professionalId;
  }

  get name() {
    return this.props.name;
  }

  get product() {
    return this.props.product;
  }

  get value() {
    return this.props.value;
  }

  get description() {
    return this.props.description;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: Optional<ProcedureProps, "createdAt">, id?: UniqueEntityID) {
    const procedure = new Procedure(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return procedure;
  }
}
