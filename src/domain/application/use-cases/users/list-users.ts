import { makeRight, type Either } from "@/core/either/either";
import type { UsersRepository } from "../../repositories/users-repository";
import type { User } from "@/domain/enterprise/entities/user";

interface ListUsersUseCaseRequest {
  page: number;
  pageSize: number;
  query: string;
}

type ListUsersUseCaseResponse = Either<
  null,
  {
    users: User[];
  }
>;

export class ListUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    page,
    pageSize,
    query,
  }: ListUsersUseCaseRequest): Promise<ListUsersUseCaseResponse> {
    const users = await this.usersRepository.getAll(page, pageSize, query);

    return makeRight({
      users,
    });
  }
}
