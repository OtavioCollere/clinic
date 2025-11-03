// src/infra/database/prisma/repositories/prisma-clients-repository.ts

import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma.service";
import type { ClientsRepository } from "@/domain/application/repositories/client-repository";
import { Client } from "@/domain/enterprise/entities/client";
import { PrismaClientMapper } from "../mappers/prisma-client-mapper";

@Injectable()
export class PrismaClientsRepository implements ClientsRepository {
  constructor(private prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: { userId },
    });

    if (!client) return null;
    return PrismaClientMapper.toDomain(client);
  }

  async findById(id: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: { id },
    });

    if (!client) return null;
    return PrismaClientMapper.toDomain(client);
  }

  async findByCpf(cpf: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: { cpf },
    });

    if (!client) return null;
    return PrismaClientMapper.toDomain(client);
  }

  async getAll(page: number, pageSize: number, query?: string): Promise<Client[]> {
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (query) {
      where.OR = [
        { cpf: { contains: query, mode: "insensitive" } },
        { phone: { contains: query, mode: "insensitive" } },
        { profession: { contains: query, mode: "insensitive" } },
      ];
    }

    const clients = await this.prisma.client.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    });

    return clients.map(PrismaClientMapper.toDomain);
  }

  async create(client: Client): Promise<Client> {
    const data = PrismaClientMapper.toPrisma(client);

    await this.prisma.client.create({ data });
    return client;
  }

  async save(client: Client): Promise<Client> {
    const data = PrismaClientMapper.toPrisma(client);

    await this.prisma.client.update({
      where: { id: data.id },
      data,
    });

    return client;
  }
}
