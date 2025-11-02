import type { HashComparer } from "@/domain/application/cryptography/hash-comparer";
import type { HashGenerator } from "@/domain/application/cryptography/hash-generator";
import { Injectable } from "@nestjs/common";
import { compare, hash } from "bcryptjs";

@Injectable()
export class BcryptHasher implements HashGenerator, HashComparer {
  async hash(plainText: string): Promise<string> {
    return await hash(plainText, 8);
  }

  async compare(plain: string, hashedPassword: string): Promise<boolean> {
    return compare(plain, hashedPassword);
  }
}
