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
import type { GetProceduresByProfessionalIdUseCase } from "@/domain/application/use-cases/procedures/get-procedures-by-professional-id";
import { ProcedurePresenter } from "../../presenters/procedures-presenter";

const getByProfessionalParamSchema = z.object({
  professionalId: z.string().uuid("Invalid professionalId format."),
});

type GetByProfessionalParamSchema = z.infer<typeof getByProfessionalParamSchema>;

@ApiTags("Procedures")
@Controller("/procedure")
@Public()
export class GetProceduresByProfessionalIdController {
  constructor(private getProceduresByProfessionalId: GetProceduresByProfessionalIdUseCase) {}

  @Get("/professional/:professionalId")
  @HttpCode(200)
  @ApiOperation({ summary: "Get procedures by professional ID" })
  @ApiParam({ name: "professionalId", required: true, description: "Professional ID" })
  @ApiOkResponse({ description: "List of procedures for a given professional" })
  @ApiBadRequestResponse({ description: "Invalid request" })
  @ApiInternalServerErrorResponse({ description: "Unexpected server error" })
  @UsePipes(new ZodValidationPipe(getByProfessionalParamSchema))
  async handle(@Param() params: GetByProfessionalParamSchema) {
    const result = await this.getProceduresByProfessionalId.execute({
      professionalId: params.professionalId,
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
