import type { User } from "@/domain/enterprise/entities/user";
import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class UsersRepository{
  abstract findById(id : string) : Promise<User | null>
  abstract findByEmail(email : string) : Promise<User | null>
  abstract create(user : User) : Promise<User>
  abstract save(user: User) : Promise<User>
}