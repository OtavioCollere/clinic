import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Procedure } from "@/domain/enterprise/entities/procedure";
import { Prisma, Procedure as PrismaProcedure } from "@/generated/client";

export class PrismaProcedureMapper {
  static toDomain(raw: PrismaProcedure): Procedure {
    return Procedure.create(
      {
        clientId: new UniqueEntityID(raw.clientId),
        professionalId: new UniqueEntityID(raw.professionalId),
        name: raw.name,
        product: raw.product ?? undefined,
        value: raw.value,
        description: raw.description ?? undefined,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(procedure: Procedure): Prisma.ProcedureUncheckedCreateInput {
    return {
      id: procedure.id.toString(),
      clientId: procedure.clientId.toString(),
      professionalId: procedure.professionalId.toString(),
      name: procedure.name,
      product: procedure.product ?? null,
      value: procedure.value,
      description: procedure.description ?? null,
      createdAt: procedure.createdAt,
      updatedAt: procedure.updatedAt ?? undefined,
    };
  }
}
