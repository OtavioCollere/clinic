import { Procedure } from "@/domain/enterprise/entities/procedure";
import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class ProceduresRepository {
  abstract findById(id: string): Promise<Procedure | null>;
  abstract getAll(page: number, pageSize: number, query?: string): Promise<Procedure[]>;
  abstract getByclientId(clientId: string, page: number, pageSize: number): Promise<Procedure[]>;
  abstract getByProfessionalId(
    professionalId: string,
    page: number,
    pageSize: number,
  ): Promise<Procedure[]>;
  abstract create(procedure: Procedure): Promise<Procedure>;

  abstract save(procedure: Procedure): Promise<Procedure>;
}
