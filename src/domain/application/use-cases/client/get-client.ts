import { makeLeft, makeRight, type Either } from "@/core/either/either";
import { Client } from "@/domain/enterprise/entities/client";
import { ClientNotFoundError } from "@/core/errors/client-not-found-error";
import type { ClientsRepository } from "../../repositories/client-repository";

interface GetClientUseCaseRequest {
  clientId: string;
}

type GetClientUseCaseResponse = Either<
  ClientNotFoundError,
  {
    client: Client;
  }
>;

export class GetClientUseCase {
  constructor(private clientsRepository: ClientsRepository) {}

  async execute({ clientId }: GetClientUseCaseRequest): Promise<GetClientUseCaseResponse> {
    const client = await this.clientsRepository.findById(clientId);

    if (!client) {
      return makeLeft(new ClientNotFoundError());
    }

    return makeRight({ client });
  }
}
