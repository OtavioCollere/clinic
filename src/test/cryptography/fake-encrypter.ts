import type { Encrypter } from "@/domain/application/cryptography/encrypter";

export class FakeEncrypter implements Encrypter {
  async sign(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload);
  }

  async signRefreshToken(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload);
  }
}
