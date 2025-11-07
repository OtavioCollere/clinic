import { Injectable } from "@nestjs/common";
import { WrongCredentialsError } from "@/core/errors/wrong-credentials-error";
import { makeLeft, makeRight, type Either } from "@/core/either/either";
import { UsersRepository } from "../../repositories/users-repository";
import { HashComparer } from "../../cryptography/hash-comparer";
import { Encrypter } from "../../cryptography/encrypter";

interface RegisterUserUseCaseRequest {
  email: string;
  password: string;
}

type RegisterUserUseCaseResponse = Either<
  WrongCredentialsError,
  {
    access_token: string;
    refresh_token: string;
  }
>;

@Injectable()
export class AuthenticateUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return makeLeft(new WrongCredentialsError());
    }

    const doesPasswordMatch = await this.hashComparer.compare(password, user.password);

    if (!doesPasswordMatch) {
      return makeLeft(new WrongCredentialsError());
    }

    const accessToken = await this.encrypter.sign({
      sub: user.id.toString(),
      role: user.role,
    });

    const refreshToken = await this.encrypter.signRefreshToken({
      sub: user.id.toString(),
      role: user.role,
    });

    return makeRight({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }
}
