// src/infra/http/controllers/anamnesis/get-anamnesis-by-client-id.ts
import { BadRequestException, Controller, Get, HttpCode, Param, UsePipes } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiParam,
} from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { isLeft, unwrapEither } from "@/core/either/either";
import { Public } from "@/infra/auth/public";
import { GetAnamnesisByClientIdUseCase } from "@/domain/application/use-cases/anamnesis/get-anamnesis-by-client-id";
import { AnamnesisPresenter } from "../../presenters/anamnesis-presenter";

const getByClientParamsSchema = z.object({
  clientId: z.string().uuid("Invalid clientId format."),
});

type GetByClientParamsSchema = z.infer<typeof getByClientParamsSchema>;

@ApiTags("Anamnesis")
@Controller("/anamnesis")
@Public()
export class GetAnamnesisByClientIdController {
  constructor(private getByClient: GetAnamnesisByClientIdUseCase) {}

  @Get("/client/:clientId")
  @HttpCode(200)
  @ApiOperation({ summary: "Get anamneses by client ID" })
  @ApiParam({ name: "clientId", required: true, description: "Client ID" })
  @ApiOkResponse({ description: "List of anamneses for the client." })
  @ApiBadRequestResponse({ description: "Invalid or malformed request." })
  @ApiInternalServerErrorResponse({ description: "Unexpected server error." })
  @UsePipes(new ZodValidationPipe(getByClientParamsSchema))
  async handle(@Param() params: GetByClientParamsSchema) {
    const result = await this.getByClient.execute({ clientId: params.clientId });

    if (isLeft(result)) {
      const error = unwrapEither(result);
      throw new BadRequestException();
    }

    const { anamneses } = unwrapEither(result);
    return { anamneses: anamneses.map(AnamnesisPresenter.toHTTP) };
  }
}
