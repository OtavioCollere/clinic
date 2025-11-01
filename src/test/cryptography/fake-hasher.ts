import type { HashComparer } from "@/domain/application/cryptography/hash-comparer";
import type { HashGenerator } from "@/domain/application/cryptography/hash-generator";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FakeHasher implements HashGenerator, HashComparer {
  async hash(plainText: string) {
    return plainText.concat("-hashed");
  }

  async compare(plain: string, hashedPassword: string) {
    return plain.concat("hashed") === hashedPassword;
  }
}
