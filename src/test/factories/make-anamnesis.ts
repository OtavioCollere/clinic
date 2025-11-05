import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Anamnesis, type AnamnesisProps } from "@/domain/enterprise/entities/anamnesis";
import type { PrismaService } from "@/infra/database/prisma.service";
import { PrismaAnamnesisMapper } from "@/infra/database/prisma/mappers/prisma-anamnesis-mapper";
import { Injectable } from "@nestjs/common";

export function makeAnamnesis(override: Partial<AnamnesisProps>, id?: UniqueEntityID) {
  const anamnesis = Anamnesis.create(
    {
      clientId: new UniqueEntityID(),
      hadPreviousAestheticTreatment: false,
      botulinumToxin: false,
      filler: false,
      suspensionThreads: false,
      surgicalLift: false,
      chemicalPeeling: false,
      laser: false,
      exposedToHeatOrColdWork: false,

      smoker: false,
      circulatoryDisorder: false,
      epilepsy: false,
      regularMenstrualCycle: true,
      regularIntestinalFunction: true,
      cardiacAlterations: false,
      hormonalDisorder: false,
      hypoOrHypertension: false,
      renalDisorder: false,
      varicoseVeinsOrLesions: false,
      pregnant: false,
      underMedicalTreatment: false,

      usesMedication: false,
      allergy: false,
      lactoseIntolerance: false,
      diabetes: null,
      roacutan: false,

      recentSurgery: false,
      tumorOrPrecancerousLesion: false,
      skinProblems: false,
      orthopedicProblems: false,
      hasBodyOrFacialProsthesis: false,
      usingAcids: false,

      createdAt: new Date(),
      ...override,
    },
    id,
  );

  return anamnesis;
}

@Injectable()
export class AnamnesisFactory {
  constructor(private prismaService: PrismaService) {}

  async makePrismaAnamnesis(data: Partial<AnamnesisProps> = {}): Promise<Anamnesis> {
    const anamnesis = makeAnamnesis(data);

    await this.prismaService.anamnesis.create({
      data: PrismaAnamnesisMapper.toPrisma(anamnesis),
    });

    return anamnesis;
  }
}
