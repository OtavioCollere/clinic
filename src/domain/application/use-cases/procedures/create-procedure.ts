import { makeLeft, makeRight, type Either } from "@/core/either/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Procedure } from "@/domain/enterprise/entities/procedure";
import type { ProceduresRepository } from "../../repositories/procedures-repository";
import type { UsersRepository } from "../../repositories/users-repository";
import type { ProfessionalsRepository } from "../../repositories/professionals-repository";
import { UserNotFoundError } from "@/core/errors/user-not-found-error";
import { ProfessionalNotFoundError } from "@/core/errors/professional-not-found-error";

interface CreateProcedureUseCaseRequest {
  clientId: string;
  professionalId: string;
  name: string;
  product?: string;
  value: number;
  description?: string;
}

type CreateProcedureUseCaseResponse = Either<
  UserNotFoundError | ProfessionalNotFoundError,
  {
    procedure: Procedure;
  }
>;

export class CreateProcedureUseCase {
  constructor(
    private proceduresRepository: ProceduresRepository,
    private usersRepository: UsersRepository,
    private professionalsRepository: ProfessionalsRepository,
  ) {}

  async execute({
    clientId,
    professionalId,
    name,
    product,
    value,
    description,
  }: CreateProcedureUseCaseRequest): Promise<CreateProcedureUseCaseResponse> {
    const userExists = await this.usersRepository.findById(clientId);
    if (!userExists) {
      return makeLeft(new UserNotFoundError());
    }

    const professionalExists = await this.professionalsRepository.findById(professionalId);
    if (!professionalExists) {
      return makeLeft(new ProfessionalNotFoundError());
    }

    const procedure = Procedure.create({
      clientId: new UniqueEntityID(clientId),
      professionalId: new UniqueEntityID(professionalId),
      name,
      product,
      value,
      description,
    });

    await this.proceduresRepository.create(procedure);

    return makeRight({ procedure });
  }
}
