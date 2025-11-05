import type { Anamnesis } from "@/domain/enterprise/entities/anamnesis";
import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class AnamnesisRepository {
  abstract findById(id: string): Promise<Anamnesis | null>;
  abstract findByAnamneseId(anamneseId: string): Promise<Anamnesis | null>;
  abstract findByClientId(clientId: string): Promise<Anamnesis[]>;
  abstract create(anamnesis: Anamnesis): Promise<Anamnesis>;
  abstract save(anamnesis: Anamnesis): Promise<Anamnesis>;
}
