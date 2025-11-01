import { EmailAlreadyExistsError } from "@/core/errors/email-already-exists-error";
import type { UsersRepository } from "../../repositories/users-repository";
import { User } from "@/domain/enterprise/entities/user";
import { makeLeft, makeRight, type Either } from "@/core/either/either";
import type { HashGenerator } from "../../cryptography/hash-generator";

interface CreateUserUseCaseRequest {
  name: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN";
}

type CreateUserUseCaseResponse = Either<
  EmailAlreadyExistsError,
  {
    user: User;
  }
>;

export class CreateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
    role,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const emailExists = await this.usersRepository.findByEmail(email);

    if (emailExists) {
      return makeLeft(new EmailAlreadyExistsError());
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await this.usersRepository.create(user);

    return makeRight({
      user,
    });
  }
}
