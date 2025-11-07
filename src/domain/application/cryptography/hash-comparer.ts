export abstract class HashComparer {
  abstract compare(plain: string, hashedPassword: string): Promise<boolean>;
}
