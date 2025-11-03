import { Client } from "@/domain/enterprise/entities/client";
import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class ClientsRepository {
  abstract findByUserId(id: string): Promise<Client | null>;
  abstract findById(id: string): Promise<Client | null>;
  abstract findByCpf(cpf: string): Promise<Client | null>;
  abstract getAll(page: number, pageSize: number, query?: string): Promise<Client[]>;
  abstract create(client: Client): Promise<Client>;
  abstract save(client: Client): Promise<Client>;
}
