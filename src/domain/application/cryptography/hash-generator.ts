export abstract class HashGenerator {
  abstract hash(plain: string, salt: number): Promise<string>;
}
