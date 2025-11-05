import { makeRight, type Either } from "@/core/either/either";
import type { ProceduresRepository } from "../../repositories/procedures-repository";
import { Procedure } from "@/domain/enterprise/entities/procedure";

interface GetProceduresByClientIdUseCaseRequest {
  clientId: string;
  page: number;
  pageSize: number;
}

type GetProceduresByClientIdUseCaseResponse = Either<
  null,
  {
    procedures: Procedure[];
  }
>;

export class GetProceduresByClientIdUseCase {
  constructor(private proceduresRepository: ProceduresRepository) {}

  async execute({
    clientId,
    page,
    pageSize,
  }: GetProceduresByClientIdUseCaseRequest): Promise<GetProceduresByClientIdUseCaseResponse> {
    const procedures = await this.proceduresRepository.getByclientId(clientId, page, pageSize);

    return makeRight({ procedures });
  }
}
