import { makeRight, type Either } from "@/core/either/either";
import type { ProfessionalsRepository } from "../../repositories/professionals-repository";
import type { Professional } from "@/domain/enterprise/entities/professional";

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
