import type { Professional } from "@/domain/enterprise/entities/professional";
import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class ProfessionalsRepository {
  abstract findById(id: string): Promise<Professional | null>;
  abstract findByLicenseNumber(licenseNumber: string): Promise<Professional | null>;
  abstract getAll(page: number, pageSize: number, query?: string): Promise<Professional[]>;
  abstract create(professional: Professional): Promise<Professional>;
  abstract save(professional: Professional): Promise<Professional>;
}
