import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import { ProceduresRepository } from "@/domain/application/repositories/procedures-repository";
import { Procedure } from "@/domain/enterprise/entities/procedure";
import { PrismaProcedureMapper } from "../mappers/prisma-procedure-mapper";

@Injectable()
export class PrismaProceduresRepository implements ProceduresRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Procedure | null> {
    const procedure = await this.prisma.procedure.findUnique({
      where: { id },
    });

    if (!procedure) return null;
    return PrismaProcedureMapper.toDomain(procedure);
  }

  async getAll(page: number, pageSize: number, query?: string): Promise<Procedure[]> {
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { product: { contains: query, mode: "insensitive" } },
      ];
    }

    const procedures = await this.prisma.procedure.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    });

    return procedures.map(PrismaProcedureMapper.toDomain);
  }

  async getByclientId(clientId: string, page: number, pageSize: number): Promise<Procedure[]> {
    const skip = (page - 1) * pageSize;

    const procedures = await this.prisma.procedure.findMany({
      where: { clientId },
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    });

    return procedures.map(PrismaProcedureMapper.toDomain);
  }

  async getByProfessionalId(
    professionalId: string,
    page: number,
    pageSize: number,
  ): Promise<Procedure[]> {
    const skip = (page - 1) * pageSize;

    const procedures = await this.prisma.procedure.findMany({
      where: { professionalId },
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    });

    return procedures.map(PrismaProcedureMapper.toDomain);
  }

  async create(procedure: Procedure): Promise<Procedure> {
    const data = PrismaProcedureMapper.toPrisma(procedure);

    await this.prisma.procedure.create({ data });

    return procedure;
  }

  async save(procedure: Procedure): Promise<Procedure> {
    const data = PrismaProcedureMapper.toPrisma(procedure);

    await this.prisma.procedure.update({
      where: { id: data.id },
      data,
    });

    return procedure;
  }
}
