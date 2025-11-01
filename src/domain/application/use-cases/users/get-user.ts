import { makeLeft, makeRight, type Either } from "@/core/either/either";
import { UserNotFoundError } from "@/core/errors/user-not-found-error";
import type { User } from "@/domain/enterprise/entities/user";
import type { UsersRepository } from "../../repositories/users-repository";

interface GetUserUseCaseRequest {
  userId: string;
}

type GetUserUseCaseResponse = Either<
  UserNotFoundError,
  {
    user: User;
  }
>;

export class GetUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId }: GetUserUseCaseRequest): Promise<GetUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return makeLeft(new UserNotFoundError());
    }

    return makeRight({
      user,
    });
  }
}
