import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { AuthModule } from "../auth/auth.module";
import { CryptographyModule } from "../cryptography/cryptography.module";

@Module({
  imports: [DatabaseModule, AuthModule, CryptographyModule],
  exports: [],
  providers: [],
  controllers: [],
})
export class HttpModule {}
