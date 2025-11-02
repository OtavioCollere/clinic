// src/infra/database/prisma/repositories/prisma-professionals-repository.ts

import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { ProfessionalsRepository } from "@/domain/application/repositories/professionals-repository";
import { Professional } from "@/domain/enterprise/entities/professional";
import { PrismaProfessionalMapper } from "../mappers/prisma-professional-mapper";

@Injectable()
export class PrismaProfessionalsRepository implements ProfessionalsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Professional | null> {
    const professional = await this.prisma.professional.findUnique({
      where: { id },
    });

    if (!professional) return null;

    return PrismaProfessionalMapper.toDomain(professional);
  }

  async findByLicenseNumber(licenseNumber: string): Promise<Professional | null> {
    const professional = await this.prisma.professional.findUnique({
      where: { licenseNumber },
    });

    if (!professional) return null;

    return PrismaProfessionalMapper.toDomain(professional);
  }

  async create(professional: Professional): Promise<Professional> {
    const data = PrismaProfessionalMapper.toPrisma(professional);

    await this.prisma.professional.create({
      data,
    });

    return professional;
  }

  async save(professional: Professional): Promise<Professional> {
    const data = PrismaProfessionalMapper.toPrisma(professional);

    await this.prisma.professional.update({
      where: { id: data.id },
      data,
    });

    return professional;
  }

  async getAll(page: number, pageSize: number, query?: string): Promise<Professional[]> {
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (query) {
      where.OR = [
        { licenseNumber: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ];
    }

    const professionals = await this.prisma.professional.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    });

    return professionals.map(PrismaProfessionalMapper.toDomain);
  }
}
