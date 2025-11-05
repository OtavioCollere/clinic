import { makeLeft, makeRight, type Either } from "@/core/either/either";
import { Client } from "@/domain/enterprise/entities/client";
import { UsersRepository } from "../../repositories/users-repository";
import { UserNotFoundError } from "@/core/errors/user-not-found-error";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ClientNotFoundError } from "@/core/errors/client-not-found-error";
import { ClientsRepository } from "../../repositories/client-repository";
import { Injectable } from "@nestjs/common";

interface EditClientUseCaseRequest {
  clientId: string;
  clientId: string;
  address: string;
  phone: string;
  birthDate: Date;
  cpf: string;
  profession: string;
  emergencyPhone?: string;
  notes?: string;
}

type EditClientUseCaseResponse = Either<
  UserNotFoundError | ClientNotFoundError,
  {
    client: Client;
  }
>;

@Injectable()
export class EditClientUseCase {
  constructor(
    private clientsRepository: ClientsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    clientId,
    clientId,
    address,
    phone,
    birthDate,
    cpf,
    profession,
    emergencyPhone,
    notes,
  }: EditClientUseCaseRequest): Promise<EditClientUseCaseResponse> {
    const existingClient = await this.clientsRepository.findById(clientId);

    if (!existingClient) {
      return makeLeft(new ClientNotFoundError());
    }

    const user = await this.usersRepository.findById(clientId);

    if (!user) {
      return makeLeft(new UserNotFoundError());
    }

    // check duplicated CPF (excluding current client)
    const duplicated = await this.clientsRepository.findByCpf(cpf);
    if (duplicated && duplicated.id.toString() !== clientId) {
      return makeLeft(new Error("Client with this CPF already exists."));
    }

    const updatedClient = Client.create(
      {
        clientId: new UniqueEntityID(clientId),
        address,
        phone,
        birthDate,
        cpf,
        profession,
        emergencyPhone,
        notes,
        createdAt: existingClient.createdAt,
        updatedAt: new Date(),
      },
      existingClient.id,
    );

    await this.clientsRepository.save(updatedClient);

    return makeRight({ client: updatedClient });
  }
}
