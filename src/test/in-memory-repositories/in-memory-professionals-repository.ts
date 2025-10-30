import { ProfessionalsRepository } from "@/domain/application/repositories/professionals-repository";
import { Professional } from "@/domain/enterprise/entities/professional";

export class InMemoryProfessionalsRepository implements ProfessionalsRepository {
  public items: Professional[] = [];

  async findById(id: string): Promise<Professional | null> {
    const professional = this.items.find((item) => item.id.toString() === id);
    return professional || null;
  }

  async findByLicenseNumber(licenseNumber: string): Promise<Professional | null> {
    const professional = this.items.find((item) => item.licenseNumber === licenseNumber);
    return professional || null;
  }

  async getAll(page: number, pageSize: number, query?: string): Promise<Professional[]> {
    let results = this.items;
    if (query) {
      results = results.filter((item) => {
        return (
          item.licenseNumber.includes(query) ||
          (item.description && item.description.includes(query))
        );
      });
    }
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return results.slice(start, end);
  }

  async create(professional: Professional): Promise<Professional> {
    this.items.push(professional);
    return professional;
  }

  async save(professional: Professional): Promise<Professional> {
    const index = this.items.findIndex(
      (item) => (item as any).id.toString() === (professional as any).id.toString(),
    );
    if (index >= 0) {
      this.items[index] = professional;
    } else {
      this.items.push(professional);
    }
    return professional;
  }
}
