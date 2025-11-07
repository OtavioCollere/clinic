import { makeRight, type Either } from "@/core/either/either";
import { ProfessionalsRepository } from "../../repositories/professionals-repository";
import { Professional } from "@/domain/enterprise/entities/professional";
import { Injectable } from "@nestjs/common";

interface ListProfessionalUseCaseRequest {
  page: number;
  query: string;
  pageSize: number;
}

type ListProfessionalUseCaseresponse = Either<
  null,
  {
    professionals: Professional[];
  }
>;

@Injectable()
export class ListProfessionalUseCase {
  constructor(private professionalsRepository: ProfessionalsRepository) {}

  async execute({
    page,
    query,
    pageSize,
  }: ListProfessionalUseCaseRequest): Promise<ListProfessionalUseCaseresponse> {
    const professionals = await this.professionalsRepository.getAll(page, pageSize, query);

    return makeRight({
      professionals,
    });
  }
}
