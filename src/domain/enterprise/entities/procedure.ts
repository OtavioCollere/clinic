import { Entity } from "@/core/entities/entity";
import type { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface ProcedureProps {
  userId: UniqueEntityID;
  professionalId: UniqueEntityID;
  name: string;
  product?: string;
  value: number;
  description?: string;
}

export class Procedure extends Entity<ProcedureProps> {}
