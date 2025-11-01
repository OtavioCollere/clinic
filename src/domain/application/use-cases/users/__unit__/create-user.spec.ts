import { describe, beforeEach, it, expect } from "vitest";
import { CreateUserUseCase } from "../create-user";
import { InMemoryUsersRepository } from "@/test/in-memory-repositories/in-memory-users-repository";
import { FakeHasher } from "@/test/cryptography/fake-hasher";
import { isRight, isLeft, unwrapEither } from "@/core/either/either";
import { EmailAlreadyExistsError } from "@/core/errors/email-already-exists-error";
import { makeUser } from "@/test/factories/make-user";

describe("CreateUserUseCase unit tests", () => {
  let sut: CreateUserUseCase;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let fakeHasher: FakeHasher;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    fakeHasher = new FakeHasher();
    sut = new CreateUserUseCase(inMemoryUsersRepository, fakeHasher);
  });

  it("should be able to create a new user", async () => {
    const result = await sut.execute({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "123456",
      role: "USER",
    });

    expect(isRight(result)).toBe(true);
    if (isRight(result)) {
      expect(inMemoryUsersRepository.items.length).toBe(1);
      expect(unwrapEither(result).user.name).toEqual("John Doe");
      expect(unwrapEither(result).user.email).toEqual("john.doe@example.com");
      expect(unwrapEither(result).user.role).toEqual("USER");
    }
  });

  it("should hash user password upon creation", async () => {
    const password = "123456";
    const result = await sut.execute({
      name: "John Doe",
      email: "john.doe@example.com",
      password,
      role: "USER",
    });

    expect(isRight(result)).toBe(true);
    if (isRight(result)) {
      const hashedPassword = await fakeHasher.hash(password);
      expect(inMemoryUsersRepository.items[0].password).toEqual(hashedPassword);
    }
  });

  it("should not be able to create a user with an existing email", async () => {
    const email = "john.doe@example.com";
    const existingUser = makeUser({
      email,
    });
    inMemoryUsersRepository.items.push(existingUser);

    const result = await sut.execute({
      name: "Jane Doe",
      email,
      password: "123456",
      role: "USER",
    });

    expect(isLeft(result)).toBe(true);
    expect(unwrapEither(result)).toBeInstanceOf(EmailAlreadyExistsError);
  });

  it("should be able to create a user with ADMIN role", async () => {
    const result = await sut.execute({
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123",
      role: "ADMIN",
    });

    expect(isRight(result)).toBe(true);
    if (isRight(result)) {
      expect(unwrapEither(result).user.role).toEqual("ADMIN");
      expect(inMemoryUsersRepository.items.length).toBe(1);
    }
  });
});
