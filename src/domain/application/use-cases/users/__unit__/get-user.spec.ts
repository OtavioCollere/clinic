import { beforeEach, describe, expect, it } from "vitest";
import { GetUserUseCase } from "../get-user";
import { InMemoryUsersRepository } from "@/test/in-memory-repositories/in-memory-users-repository";
import { makeUser } from "@/test/factories/make-user";
import { isRight, isLeft, unwrapEither } from "@/core/either/either";
import { UserNotFoundError } from "@/core/errors/user-not-found-error";

describe("GetUserUseCase unit tests", () => {
  let sut: GetUserUseCase;
  let inMemoryUsersRepository: InMemoryUsersRepository;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new GetUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to get a user by id", async () => {
    const user = makeUser({
      name: "John Doe",
      email: "john.doe@example.com",
    });

    inMemoryUsersRepository.items.push(user);

    const result = await sut.execute({
      clientId: user.id.toString(),
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).user.name).toEqual("John Doe");
      expect(unwrapEither(result).user.email).toEqual("john.doe@example.com");
    }
  });

  it("should not be able to get a user with an invalid id", async () => {
    const result = await sut.execute({
      clientId: "non-existing-id",
    });

    expect(isLeft(result)).toBe(true);
    expect(unwrapEither(result)).toBeInstanceOf(UserNotFoundError);
  });
});
