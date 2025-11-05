import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Professional, type ProfessionalProps } from "@/domain/enterprise/entities/professional";
import type { PrismaService } from "@/infra/database/prisma.service";
import { PrismaProfessionalMapper } from "@/infra/database/prisma/mappers/prisma-professional-mapper";
import { Injectable } from "@nestjs/common";

export function makeProfessional(override: Partial<ProfessionalProps>, id?: UniqueEntityID) {
  const professional = Professional.create(
    {
      clientId: new UniqueEntityID(),
      licenseNumber: "1234",
      description: "some description",
      type: "MEDICO",
      ...override,
    },
    id,
  );
  return professional;
}

@Injectable()
export class ProfessionalFactory {
  constructor(private prismaService: PrismaService) {}

  async makePrismaProfessional(data: Partial<ProfessionalProps> = {}): Promise<Professional> {
    const professional = makeProfessional(data);

    await this.prismaService.professional.create({
      data: PrismaProfessionalMapper.toPrisma(professional),
    });

    return professional;
  }
}
