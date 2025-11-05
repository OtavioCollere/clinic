import { ProceduresRepository } from "@/domain/application/repositories/procedures-repository";
import { Procedure } from "@/domain/enterprise/entities/procedure";

export class InMemoryProceduresRepository implements ProceduresRepository {
  public items: Procedure[] = [];

  async findById(id: string): Promise<Procedure | null> {
    const procedure = this.items.find((item) => item.id.toString() === id);
    return procedure || null;
  }

  async getAll(page: number, pageSize: number, query?: string): Promise<Procedure[]> {
    let results = this.items;
    if (query) {
      const lower = query.toLowerCase();
      results = results.filter(
        (item) =>
          item.name.toLowerCase().includes(lower) ||
          item.description?.toLowerCase().includes(lower),
      );
    }

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return results.slice(start, end);
  }

  async getByclientId(clientId: string, page: number, pageSize: number): Promise<Procedure[]> {
    const results = this.items.filter((item) => item.clientId.toString() === clientId);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return results.slice(start, end);
  }

  async getByProfessionalId(
    professionalId: string,
    page: number,
    pageSize: number,
  ): Promise<Procedure[]> {
    const results = this.items.filter((item) => item.professionalId.toString() === professionalId);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return results.slice(start, end);
  }

  async create(procedure: Procedure): Promise<Procedure> {
    this.items.push(procedure);
    return procedure;
  }

  async save(procedure: Procedure): Promise<Procedure> {
    const index = this.items.findIndex((item) => item.id.toString() === procedure.id.toString());
    if (index >= 0) {
      this.items[index] = procedure;
    } else {
      this.items.push(procedure);
    }
    return procedure;
  }
}
