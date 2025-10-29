import type { Either } from "@/core/either/either";
import type { UsersRepository } from "../../repositories/users-repository";


interface CreateUserUseCaseRequest{
  name: string
  email: string
  password: string
}

type CreateUserUseCaseResponse = Either<
,
{}
>

export class CreateUserUseCase{
CreateUserUseCaseResponse
  constructor(private usersRepository: UsersRepository) {}

  async execute({name, email, password} : CreateUserUseCaseRequest) : Promise<CreateUserUseCaseResponse> {

  }

}