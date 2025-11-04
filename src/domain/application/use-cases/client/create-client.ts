import { makeLeft, makeRight, type Either } from "@/core/either/either";
import { UsersRepository } from "../../repositories/users-repository";
import { UserNotFoundError } from "@/core/errors/user-not-found-error";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ClientsRepository } from "../../repositories/client-repository";
import { Client } from "@/domain/enterprise/entities/client";
import { CpfAlreadyExistsError } from "@/core/errors/cpf-already-exists-error";
import { Injectable } from "@nestjs/common";

interface CreateClientUseCaseRequest {
  userId: string;
  address: string;
  phone: string;
  birthDate: Date;
  cpf: string;
  profession: string;
  emergencyPhone?: string;
  notes?: string;
}

type CreateClientUseCaseResponse = Either<
  UserNotFoundError | CpfAlreadyExistsError,
  {
    client: Client;
  }
>;

@Injectable()
export class CreateClientUseCase {
  constructor(
    private clientsRepository: ClientsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    address,
    phone,
    birthDate,
    cpf,
    profession,
    emergencyPhone,
    notes,
  }: CreateClientUseCaseRequest): Promise<CreateClientUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return makeLeft(new UserNotFoundError());
    }

    const cpfExists = await this.clientsRepository.findByCpf(cpf);

    if (cpfExists) {
      return makeLeft(new CpfAlreadyExistsError());
    }

    const client = Client.create({
      userId: new UniqueEntityID(userId),
      address,
      phone,
      birthDate,
      cpf,
      profession,
      emergencyPhone,
      notes,
    });

    await this.clientsRepository.save(client);

    return makeRight({ client });
  }
}
