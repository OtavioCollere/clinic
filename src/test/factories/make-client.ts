import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Client, type ClientProps } from "@/domain/enterprise/entities/client";
import { PrismaService } from "@/infra/database/prisma.service";
import { PrismaClientMapper } from "@/infra/database/prisma/mappers/prisma-client-mapper";
import { Injectable } from "@nestjs/common";

export function makeClient(override: Partial<ClientProps> = {}, id?: UniqueEntityID) {
  const client = Client.create(
    {
      userId: new UniqueEntityID(),
      address: "123 Main Street",
      phone: "(11) 99999-9999",
      birthDate: new Date("1990-01-01"),
      cpf: "12345678900",
      profession: "Doctor",
      emergencyPhone: "(11) 98888-8888",
      notes: "Test client notes",
      ...override,
    },
    id,
  );

  return client;
}

@Injectable()
export class ClientFactory {
  constructor(private prismaService: PrismaService) {}

  async makePrismaClient(data: Partial<ClientProps> = {}): Promise<Client> {
    const client = makeClient(data);

    await this.prismaService.client.create({
      data: PrismaClientMapper.toPrisma(client),
    });

    return client;
  }
}
