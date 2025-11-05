import { Module } from "@nestjs/common";
import { HttpModule } from "./infra/http/http.module";
import { EnvModule } from "./infra/env/env.module";
import { ConfigModule } from "@nestjs/config";
import { envSchema } from "./infra/env/env";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => envSchema.parse(env),
    }),
    EnvModule,
    HttpModule,
  ],
})
export class AppModule {}
