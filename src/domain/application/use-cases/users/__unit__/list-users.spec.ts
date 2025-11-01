import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "@/test/in-memory-repositories/in-memory-users-repository";
import { makeUser } from "@/test/factories/make-user";
import { isRight, unwrapEither } from "@/core/either/either";
import { ListUsersUseCase } from "../list-users";

describe("ListUsersUseCase unit tests", () => {
  let sut: ListUsersUseCase;
  let inMemoryUsersRepository: InMemoryUsersRepository;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new ListUsersUseCase(inMemoryUsersRepository);
  });

  it("should be able to list users", async () => {
    for (let i = 1; i <= 10; i++) {
      const user = makeUser({
        name: `User ${i}`,
        email: `user${i}@example.com`,
      });
      inMemoryUsersRepository.items.push(user);
    }

    const result = await sut.execute({
      page: 1,
      pageSize: 5,
      query: "",
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).users.length).toBe(5);
    }
  });

  it("should be able to list users with pagination and query", async () => {
    for (let i = 1; i <= 10; i++) {
      const user = makeUser({
        name: i <= 5 ? `John Doe ${i}` : `Jane Smith ${i}`,
        email: i <= 5 ? `john${i}@example.com` : `jane${i}@example.com`,
      });
      inMemoryUsersRepository.items.push(user);
    }

    const result = await sut.execute({
      page: 1,
      pageSize: 3,
      query: "John",
    });

    expect(isRight(result)).toBeTruthy();
    if (isRight(result)) {
      expect(unwrapEither(result).users.length).toBe(3);
      expect(unwrapEither(result).users[0].name).toContain("John");
      expect(unwrapEither(result).users[1].name).toContain("John");
      expect(unwrapEither(result).users[2].name).toContain("John");
    }
  });
});

