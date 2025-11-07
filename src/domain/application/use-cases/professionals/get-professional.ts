import { makeLeft, makeRight, type Either } from "@/core/either/either";
import { ProfessionalNotFoundError } from "@/core/errors/professional-not-found-error";
import { Professional } from "@/domain/enterprise/entities/professional";
import { ProfessionalsRepository } from "../../repositories/professionals-repository";
import { Injectable } from "@nestjs/common";

interface GetProfessionalUseCaseRequest {
  professionalId: string;
}

type GetProfessionalUseCaseResponse = Either<
  ProfessionalNotFoundError,
  {
    professional: Professional;
  }
>;

@Injectable()
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
