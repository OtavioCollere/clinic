import { Anamnesis } from "@/domain/enterprise/entities/anamnesis";
import type { AnamnesisRepository } from "@/domain/application/repositories/anamnesis-repository";

export class InMemoryAnamnesisRepository implements AnamnesisRepository {
  public items: Anamnesis[] = [];

  async findById(id: string): Promise<Anamnesis | null> {
    const anamnesis = this.items.find((item) => item.id.toString() === id);
    return anamnesis || null;
  }

  async findByAnamneseId(anamneseId: string): Promise<Anamnesis | null> {
    const anamnesis = this.items.find((item) => item.id.toString() === anamneseId);
    return anamnesis || null;
  }

  async findByClientId(clientId: string): Promise<Anamnesis[]> {
    return this.items.filter((item) => item.clientId.toString() === clientId);
  }

  async create(anamnesis: Anamnesis): Promise<Anamnesis> {
    this.items.push(anamnesis);
    return anamnesis;
  }

  async save(anamnesis: Anamnesis): Promise<Anamnesis> {
    const index = this.items.findIndex((item) => item.id.toString() === anamnesis.id.toString());

    if (index >= 0) {
      this.items[index] = anamnesis;
    } else {
      this.items.push(anamnesis);
    }

    return anamnesis;
  }
}
