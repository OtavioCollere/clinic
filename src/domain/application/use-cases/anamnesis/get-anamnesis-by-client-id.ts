import { makeRight, type Either } from "@/core/either/either";
import type { AnamnesisRepository } from "../../repositories/anamnesis-repository";
import { Anamnesis } from "@/domain/enterprise/entities/anamnesis";

interface GetAnamnesisByClientIdUseCaseRequest {
  clientId: string;
}

type GetAnamnesisByClientIdUseCaseResponse = Either<
  null,
  {
    anamneses: Anamnesis[];
  }
>;

export class GetAnamnesisByClientIdUseCase {
  constructor(private anamnesisRepository: AnamnesisRepository) {}

  async execute({
    clientId,
  }: GetAnamnesisByClientIdUseCaseRequest): Promise<GetAnamnesisByClientIdUseCaseResponse> {
    const anamneses = await this.anamnesisRepository.findByClientId(clientId);

    return makeRight({ anamneses });
  }
}
