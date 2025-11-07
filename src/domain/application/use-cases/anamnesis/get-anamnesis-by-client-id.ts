import { makeRight, type Either } from "@/core/either/either";
import { AnamnesisRepository } from "../../repositories/anamnesis-repository";
import { Anamnesis } from "@/domain/enterprise/entities/anamnesis";
import { Injectable } from "@nestjs/common";

interface GetAnamnesisByClientIdUseCaseRequest {
  clientId: string;
}

type GetAnamnesisByClientIdUseCaseResponse = Either<
  null,
  {
    anamneses: Anamnesis[];
  }
>;

@Injectable()
export class GetAnamnesisByClientIdUseCase {
  constructor(private anamnesisRepository: AnamnesisRepository) {}

  async execute({
    clientId,
  }: GetAnamnesisByClientIdUseCaseRequest): Promise<GetAnamnesisByClientIdUseCaseResponse> {
    const anamneses = await this.anamnesisRepository.findByClientId(clientId);

    return makeRight({ anamneses });
  }
}
