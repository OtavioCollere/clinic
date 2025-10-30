import { User, UserProps } from "../../src/domain/enterprise/entities/user";
import { faker } from "@faker-js/faker";

export function makeUser(override: Partial<UserProps>, id?: string) {
  const user = User.create({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...override,
  });

  return user;
}
