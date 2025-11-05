import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  UsePipes,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
} from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { isLeft, unwrapEither } from "@/core/either/either";
import { Public } from "@/infra/auth/public";
import { ProfessionalNotFoundError } from "@/core/errors/professional-not-found-error";
import type { GetProfessionalUseCase } from "@/domain/application/use-cases/professionals/get-professional";
import { ProfessionalPresenter } from "../../presenters/professional-presenter";

const getProfessionalParamSchema = z.object({
  professionalId: z.string().uuid("Invalid professionalId format."),
});

type GetProfessionalParamSchema = z.infer<typeof getProfessionalParamSchema>;

@ApiTags("Professionals")
@Controller("/professionals")
@Public()
export class GetProfessionalController {
  constructor(private getProfessional: GetProfessionalUseCase) {}

  @Get("/:professionalId")
  @HttpCode(200)
  @ApiOperation({
    summary: "Get professional by ID",
    description: "Returns the professional corresponding to the provided ID.",
  })
  @ApiParam({
    name: "professionalId",
    required: true,
    description: "UUID of the professional to retrieve.",
  })
  @ApiOkResponse({
    description: "Professional successfully retrieved.",
  })
  @ApiNotFoundResponse({
    description: "Professional not found.",
  })
  @ApiBadRequestResponse({
    description: "Invalid or malformed ID.",
  })
  @ApiInternalServerErrorResponse({
    description: "Unexpected server error.",
  })
  @UsePipes(new ZodValidationPipe(getProfessionalParamSchema))
  async handle(@Param() params: GetProfessionalParamSchema) {
    const { professionalId } = params;

    const result = await this.getProfessional.execute(professionalId);

    if (isLeft(result)) {
      const error = unwrapEither(result);

      switch (error.constructor) {
        case ProfessionalNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { professional } = unwrapEither(result);
    return { professional: ProfessionalPresenter.toHTTP(professional) };
  }
}
