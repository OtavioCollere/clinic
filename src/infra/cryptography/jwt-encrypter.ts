import { Encrypter } from "@/domain/application/cryptography/encrypter";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtEncrypter implements Encrypter {
  constructor(private jwtService: JwtService) {}

  async sign(payload: Record<string, unknown>): Promise<string> {
    return this.jwtService.signAsync(payload, { expiresIn: "15m" });
  }

  async signRefreshToken(payload: Record<string, unknown>): Promise<string> {
    return this.jwtService.signAsync(payload, { expiresIn: "7d" });
  }
}
