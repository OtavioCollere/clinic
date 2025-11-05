import { makeLeft, makeRight, type Either } from "@/core/either/either";
import { Procedure } from "@/domain/enterprise/entities/procedure";
import type { ProceduresRepository } from "../../repositories/procedures-repository";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ProcedureNotFoundError } from "@/core/errors/procedure-not-found-error";

interface EditProcedureUseCaseRequest {
  procedureId: string;
  clientId: string;
  professionalId: string;
  name: string;
  product?: string;
  value: number;
  description?: string;
}

type EditProcedureUseCaseResponse = Either<
  ProcedureNotFoundError,
  {
    procedure: Procedure;
  }
>;

export class EditProcedureUseCase {
  constructor(private proceduresRepository: ProceduresRepository) {}

  async execute({
    procedureId,
    clientId,
    professionalId,
    name,
    product,
    value,
    description,
  }: EditProcedureUseCaseRequest): Promise<EditProcedureUseCaseResponse> {
    const procedure = await this.proceduresRepository.findById(procedureId);

    if (!procedure) {
      return makeLeft(new ProcedureNotFoundError());
    }

    const updated = Procedure.create(
      {
        clientId: new UniqueEntityID(clientId),
        professionalId: new UniqueEntityID(professionalId),
        name,
        product,
        value,
        description,
        createdAt: procedure.createdAt,
        updatedAt: new Date(),
      },
      procedure.id,
    );

    await this.proceduresRepository.save(updated);

    return makeRight({ procedure: updated });
  }
}
