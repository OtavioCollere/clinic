// src/infra/database/prisma/mappers/prisma-client-mapper.ts

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Client } from "@/domain/enterprise/entities/client";
import { Prisma, Client as PrismaClient } from "@/generated/client";

export class PrismaClientMapper {
  static toDomain(raw: PrismaClient): Client {
    return Client.create(
      {
        clientId: new UniqueEntityID(raw.userId),
        address: raw.address,
        phone: raw.phone,
        birthDate: raw.birthDate,
        cpf: raw.cpf,
        profession: raw.profession,
        emergencyPhone: raw.emergencyPhone ?? undefined,
        notes: raw.notes ?? undefined,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(client: Client): Prisma.ClientUncheckedCreateInput {
    return {
      id: client.id.toString(),
      userId: client.clientId.toString(),
      address: client.address,
      phone: client.phone,
      birthDate: client.birthDate,
      cpf: client.cpf,
      profession: client.profession,
      emergencyPhone: client.emergencyPhone ?? null, // converte undefined → null
      notes: client.notes ?? null, // mantém o nome do domínio (notes)
    };
  }
}
