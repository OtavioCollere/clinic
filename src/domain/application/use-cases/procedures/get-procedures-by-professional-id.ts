import { makeRight, type Either } from "@/core/either/either";
import type { ProceduresRepository } from "../../repositories/procedures-repository";
import { Procedure } from "@/domain/enterprise/entities/procedure";

interface GetProceduresByProfessionalIdUseCaseRequest {
  professionalId: string;
  page: number;
  pageSize: number;
}

type GetProceduresByProfessionalIdUseCaseResponse = Either<
  null,
  {
    procedures: Procedure[];
  }
>;

export class GetProceduresByProfessionalIdUseCase {
  constructor(private proceduresRepository: ProceduresRepository) {}

  async execute({
    professionalId,
    page,
    pageSize,
  }: GetProceduresByProfessionalIdUseCaseRequest): Promise<GetProceduresByProfessionalIdUseCaseResponse> {
    const procedures = await this.proceduresRepository.getByProfessionalId(
      professionalId,
      page,
      pageSize,
    );

    return makeRight({ procedures });
  }
}
