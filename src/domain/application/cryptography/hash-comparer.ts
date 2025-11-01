import { Injectable } from "@nestjs/common";

@Injectable()
export class HashComparer {
  async compare(plain: string, hashedPassword: string) {
    return plain.concat("hashed") === hashedPassword;
  }
}
