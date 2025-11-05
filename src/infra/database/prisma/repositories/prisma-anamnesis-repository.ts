import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { AnamnesisRepository } from "@/domain/application/repositories/anamnesis-repository";
import { Anamnesis } from "@/domain/enterprise/entities/anamnesis";
import { PrismaAnamnesisMapper } from "../mappers/prisma-anamnesis-mapper";

@Injectable()
export class PrismaAnamnesisRepository implements AnamnesisRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Anamnesis | null> {
    const anamnesis = await this.prisma.anamnesis.findUnique({
      where: { id },
    });

    if (!anamnesis) return null;
    return PrismaAnamnesisMapper.toDomain(anamnesis);
  }

  async findByAnamneseId(anamneseId: string): Promise<Anamnesis | null> {
    const anamnesis = await this.prisma.anamnesis.findUnique({
      where: { id: anamneseId },
    });

    if (!anamnesis) return null;
    return PrismaAnamnesisMapper.toDomain(anamnesis);
  }

  async findByUserId(userId: string): Promise<Anamnesis[]> {
    const anamneses = await this.prisma.anamnesis.findMany({
      where: { clientId: userId },
      orderBy: { createdAt: "desc" },
    });

    return anamneses.map(PrismaAnamnesisMapper.toDomain);
  }

  async findByClientId(clientId: string): Promise<Anamnesis[]> {
    const anamneses = await this.prisma.anamnesis.findMany({
      where: { clientId },
      orderBy: { createdAt: "desc" },
    });

    return anamneses.map(PrismaAnamnesisMapper.toDomain);
  }

  async create(anamnesis: Anamnesis): Promise<Anamnesis> {
    const data = PrismaAnamnesisMapper.toPrisma(anamnesis);

    await this.prisma.anamnesis.create({ data });

    return anamnesis;
  }

  async save(anamnesis: Anamnesis): Promise<Anamnesis> {
    const data = PrismaAnamnesisMapper.toPrisma(anamnesis);

    await this.prisma.anamnesis.update({
      where: { id: data.id },
      data,
    });

    return anamnesis;
  }
}
