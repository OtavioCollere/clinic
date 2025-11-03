// src/infra/database/prisma/mappers/prisma-client-mapper.ts

import { Client } from "@/domain/enterprise/entities/client";
import { Prisma, Client as PrismaClient } from "@prisma/client";

export class PrismaClientMapper {
  static toDomain(raw: PrismaClient): Client {
    return new Client(
      {
        userId: raw.userId,
        address: raw.address,
        phone: raw.phone,
        birthDate: raw.birthDate,
        cpf: raw.cpf,
        profession: raw.profession,
        emergencyPhone: raw.emergencyPhone,
        obs: raw.obs,
      },
      raw.id,
    );
  }

  static toPrisma(client: Client): Prisma.ClientUncheckedCreateInput {
    return {
      id: client.id.toString(),
      userId: client.userId.toString(),
      address: client.address,
      phone: client.phone,
      birthDate: client.birthDate,
      cpf: client.cpf,
      profession: client.profession,
      emergencyPhone: client.emergencyPhone,
      obs: client.obs,
    };
  }
}
