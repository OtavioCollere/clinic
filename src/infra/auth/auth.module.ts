import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { EnvModule } from "../env/env.module";
import { EnvService } from "../env/env.service";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { JwtStrategy } from "./jwt-strategy";

@Module({
  imports: [
    EnvModule,
    JwtModule.registerAsync({
      global: true,
      imports: [EnvModule],
      inject: [EnvService],
      useFactory(env: EnvService) {
        const publicKey = env.get("JWT_PUBLIC_KEY");
        const privateKey = env.get("JWT_PRIVATE_KEY");

        return {
          signOptions: { algorithm: "RS256" },
          privateKey: Buffer.from(privateKey, "base64"),
          publicKey: Buffer.from(publicKey, "base64"),
        };
      },
    }),
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }, JwtStrategy, JwtService],
})
export class AuthModule {}
