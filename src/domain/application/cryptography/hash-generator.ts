import { Injectable } from "@nestjs/common";

@Injectable()
export class HashGenerator {
  async hash(plainText: string) {
    return plainText.concat("-hashed");
  }
}
