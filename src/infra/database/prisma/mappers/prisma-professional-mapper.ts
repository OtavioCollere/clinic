// src/infra/database/prisma/mappers/prisma-professional-mapper.ts

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Professional } from "@/domain/enterprise/entities/professional";
import { Professional as PrismaProfessional, ProfessionalType } from "@/generated/client";

export class PrismaProfessionalMapper {
  static toDomain(raw: PrismaProfessional): Professional {
    return Professional.create(
      {
        clientId: new UniqueEntityID(raw.clientId),
        type: raw.type as ProfessionalType,
        licenseNumber: raw.licenseNumber,
        description: raw.description ?? undefined,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(professional: Professional): PrismaProfessional {
    return {
      id: professional.id.toString(),
      clientId: professional.clientId.toString(),
      type: professional.type,
      licenseNumber: professional.licenseNumber,
      description: professional.description ?? null,
      createdAt: professional.createdAt ?? new Date(),
      updatedAt: professional.updatedAt ?? new Date(),
    };
  }
}
