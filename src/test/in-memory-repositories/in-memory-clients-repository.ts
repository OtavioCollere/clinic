// src/infra/database/in-memory/repositories/in-memory-clients-repository.ts

import type { ClientsRepository } from "@/domain/application/repositories/client-repository";
import { Client } from "@/domain/enterprise/entities/client";

export class InMemoryClientsRepository implements ClientsRepository {
  public items: Client[] = [];

  async findByUserId(clientId: string): Promise<Client | null> {
    const client = this.items.find((item) => item.clientId.toString() === clientId);
    return client || null;
  }

  async findById(id: string): Promise<Client | null> {
    const client = this.items.find((item) => item.id.toString() === id);
    return client || null;
  }

  async findByCpf(cpf: string): Promise<Client | null> {
    const client = this.items.find((item) => item.cpf === cpf);
    return client || null;
  }

  async getAll(page: number, pageSize: number, query?: string): Promise<Client[]> {
    let results = this.items;

    if (query) {
      results = results.filter((item) => {
        return (
          item.cpf.includes(query) ||
          item.phone.includes(query) ||
          (item.profession && item.profession.includes(query))
        );
      });
    }

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return results.slice(start, end);
  }

  async create(client: Client): Promise<Client> {
    this.items.push(client);
    return client;
  }

  async save(client: Client): Promise<Client> {
    const index = this.items.findIndex((item) => item.id.toString() === client.id.toString());

    if (index >= 0) {
      this.items[index] = client;
    } else {
      this.items.push(client);
    }

    return client;
  }
}
