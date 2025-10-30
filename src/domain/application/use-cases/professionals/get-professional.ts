import { makeLeft, makeRight, type Either } from "@/core/either/either";
import { ProfessionalNotFoundError } from "@/core/errors/professional-not-found-error";
import type { Professional } from "@/domain/enterprise/entities/professional";
import type { ProfessionalsRepository } from "../../repositories/professionals-repository";

interface GetProfessionalUseCaseRequest {
  professionalId: string;
}

type GetProfessionalUseCaseResponse = Either<
  ProfessionalNotFoundError,
  {
    professional: Professional;
  }
>;

export class GetProfessionalUseCase {
  constructor(private professionalsRepository: ProfessionalsRepository) {}

  async execute(id: string): Promise<GetProfessionalUseCaseResponse> {
    const professional = await this.professionalsRepository.findById(id);
    if (!professional) {
      return makeLeft(new ProfessionalNotFoundError());
    }
    return makeRight({ professional });
  }
}
