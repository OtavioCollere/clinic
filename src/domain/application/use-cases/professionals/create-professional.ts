import { makeLeft, makeRight, type Either } from "@/core/either/either";
import { LicenseNumberAlreadyExistsError } from "@/core/errors/license-number-already-exists-error";
import { UserNotFoundError } from "@/core/errors/user-not-found-error";
import { ProfessionalsRepository } from "../../repositories/professionals-repository";
import { UsersRepository } from "../../repositories/users-repository";
import { Professional } from "@/domain/enterprise/entities/professional";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Injectable } from "@nestjs/common";

interface CreateProfessionalUseCaseRequest {
  userId: string;
  type: "MEDICO" | "BIOMEDICO" | "ODONTO";
  licenseNumber: string;
  description?: string;
}

type CreateProfessionalUseCaseResponse = Either<
  UserNotFoundError | LicenseNumberAlreadyExistsError,
  {
    professional: Professional;
  }
>;

@Injectable()
export class CreateProfessionalUseCase {
  constructor(
    private professionalsRepository: ProfessionalsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    type,
    licenseNumber,
    description,
  }: CreateProfessionalUseCaseRequest): Promise<CreateProfessionalUseCaseResponse> {
    const userExists = await this.usersRepository.findById(userId);

    if (!userExists) {
      return makeLeft(new UserNotFoundError());
    }

    const licenseExists = await this.professionalsRepository.findByLicenseNumber(licenseNumber);

    if (licenseExists) {
      return makeLeft(new LicenseNumberAlreadyExistsError());
    }

    const professional = Professional.create({
      userId: new UniqueEntityID(userId),
      type,
      licenseNumber,
      description,
    });

    await this.professionalsRepository.save(professional);

    return makeRight({ professional });
  }
}
