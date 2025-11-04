import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { AuthModule } from "../auth/auth.module";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { CreateClientController } from "./controllers/clients/create-client";
import { EditClientController } from "./controllers/clients/edit-client";
import { GetClientController } from "./controllers/clients/get-client";
import { CreateClientUseCase } from "@/domain/application/use-cases/client/create-client";
import { EditClientUseCase } from "@/domain/application/use-cases/client/edit-client";
import { GetClientUseCase } from "@/domain/application/use-cases/client/get-client";

@Module({
  imports: [DatabaseModule, AuthModule, CryptographyModule],
  exports: [],
  providers: [CreateClientUseCase, EditClientUseCase, GetClientUseCase],
  controllers: [CreateClientController, EditClientController],
})
export class HttpModule {}
