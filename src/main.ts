import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { EnvService } from "./infra/env/env.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("Clinic")
    .setDescription("API Documentation")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document); // URL: http://localhost:3000/api/docs

  const configService = app.get(EnvService);
  const port = configService.get("PORT");

  await app.listen(port);
}
bootstrap();
