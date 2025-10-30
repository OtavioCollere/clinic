import { Entity } from "@/core/entities/entity";
import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { Optional } from "@/core/types/optional";

export interface UserProps {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class User extends Entity<UserProps> {
  static create(props: Optional<UserProps, "createdAt" | "updatedAt">, id?: UniqueEntityID) {
    const user = new User(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    );

    return user;
  }

  // ---------- GETTERS ----------
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  // ---------- SETTERS ----------
  set name(value: string) {
    this.props.name = value;
    this.touch();
  }

  set email(value: string) {
    this.props.email = value;
    this.touch();
  }

  set password(value: string) {
    this.props.password = value;
    this.touch();
  }

  // ---------- PRIVATE ----------
  private touch() {
    this.props.updatedAt = new Date();
  }
}
