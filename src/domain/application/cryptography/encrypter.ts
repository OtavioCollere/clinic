export abstract class Encrypter {
  abstract sign(payload: Record<string, unknown>): Promise<string>;
  abstract signRefreshToken(payload: Record<string, unknown>): Promise<string>;
}
