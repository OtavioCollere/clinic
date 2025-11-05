import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Procedure, type ProcedureProps } from "@/domain/enterprise/entities/procedure";
import type { PrismaService } from "@/infra/database/prisma.service";
import { PrismaProcedureMapper } from "@/infra/database/prisma/mappers/prisma-procedure-mapper";
import { Injectable } from "@nestjs/common";

export function makeProcedure(override: Partial<ProcedureProps>, id?: UniqueEntityID) {
  const procedure = Procedure.create(
    {
      clientId: new UniqueEntityID(),
      professionalId: new UniqueEntityID(),
      name: "Limpeza de pele",
      product: "Produto XYZ",
      value: 250,
      description: "Procedimento estético de limpeza facial completa.",
      ...override,
    },
    id,
  );

  return procedure;
}

@Injectable()
export class ProcedureFactory {
  constructor(private prismaService: PrismaService) {}

  async makePrismaProcedure(data: Partial<ProcedureProps> = {}): Promise<Procedure> {
    const procedure = makeProcedure(data);

    await this.prismaService.procedure.create({
      data: PrismaProcedureMapper.toPrisma(procedure),
    });

    return procedure;
  }
}
