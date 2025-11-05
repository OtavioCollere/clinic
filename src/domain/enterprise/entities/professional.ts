import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface ProfessionalProps {
  clientId: UniqueEntityID;
  type: "MEDICO" | "BIOMEDICO" | "ODONTO";
  licenseNumber: string;
  description?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class Professional extends Entity<ProfessionalProps> {
  static create(
    props: Optional<ProfessionalProps, "createdAt" | "updatedAt">,
    id?: UniqueEntityID,
  ) {
    const professional = new Professional(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    );

    return professional;
  }

  // ---------- GETTERS ----------
  get clientId() {
    return this.props.clientId;
  }

  get type(): "MEDICO" | "BIOMEDICO" | "ODONTO" {
    return this.props.type;
  }

  get licenseNumber() {
    return this.props.licenseNumber;
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

  // ---------- SETTERS ----------
  set type(value: "MEDICO" | "BIOMEDICO" | "ODONTO") {
    this.props.type = value;
    this.touch();
  }

  set licenseNumber(value: string) {
    this.props.licenseNumber = value;
    this.touch();
  }

  set description(value: string | undefined) {
    this.props.description = value;
    this.touch();
  }

  // ---------- PRIVATE ----------
  private touch() {
    this.props.updatedAt = new Date();
  }
}
