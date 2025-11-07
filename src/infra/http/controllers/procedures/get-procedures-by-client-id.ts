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
import { GetProceduresByClientIdUseCase } from "@/domain/application/use-cases/procedures/get-procedures-by-client-id";
import { ProcedurePresenter } from "../../presenters/procedures-presenter";

const getByClientParamSchema = z.object({
  clientId: z.string().uuid("Invalid clientId format."),
});

type GetByClientParamSchema = z.infer<typeof getByClientParamSchema>;

@ApiTags("Procedures")
@Controller("/procedure")
@Public()
export class GetProceduresByClientIdController {
  constructor(private getProceduresByClientId: GetProceduresByClientIdUseCase) {}

  @Get("/client/:clientId")
  @HttpCode(200)
  @ApiOperation({ summary: "Get procedures by client ID" })
  @ApiParam({ name: "clientId", required: true, description: "Client ID" })
  @ApiOkResponse({ description: "List of procedures for a given client" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiInternalServerErrorResponse({ description: "Unexpected server error" })
  @UsePipes(new ZodValidationPipe(getByClientParamSchema))
  async handle(@Param() params: GetByClientParamSchema) {
    const result = await this.getProceduresByClientId.execute({
      clientId: params.clientId,
      page: 1,
      pageSize: 50,
    });

    if (isLeft(result)) {
      const error = unwrapEither(result);
      throw new BadRequestException();
    }

    const { procedures } = unwrapEither(result);
    return { procedures: procedures.map(ProcedurePresenter.toHTTP) };
  }
}
