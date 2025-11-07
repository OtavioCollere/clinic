import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { isLeft, unwrapEither } from "@/core/either/either";
import { Public } from "@/infra/auth/public";
import { UserNotFoundError } from "@/core/errors/user-not-found-error";
import { ProfessionalNotFoundError } from "@/core/errors/professional-not-found-error";
import { CreateProcedureUseCase } from "@/domain/application/use-cases/procedures/create-procedure";
import { ProcedurePresenter } from "../../presenters/procedures-presenter";

const createProcedureBodySchema = z.object({
  clientId: z.string().uuid("Invalid clientId format."),
  professionalId: z.string().uuid("Invalid professionalId format."),
  name: z.string().min(1),
  product: z.string().optional(),
  value: z.coerce.number().positive(),
  description: z.string().optional(),
});

type CreateProcedureBodySchema = z.infer<typeof createProcedureBodySchema>;

@ApiTags("Procedures")
@Controller("/procedure")
@Public()
export class CreateProcedureController {
  constructor(private createProcedure: CreateProcedureUseCase) {}

  @Post("/create")
  @HttpCode(201)
  @ApiOperation({
    summary: "Create a new procedure",
    description: "Registers a new procedure associated with a client and a professional.",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        clientId: { type: "string", format: "uuid" },
        professionalId: { type: "string", format: "uuid" },
        name: { type: "string", example: "Peeling químico" },
        product: { type: "string", example: "Ácido Mandélico" },
        value: { type: "number", example: 300 },
        description: { type: "string", example: "Tratamento facial de rejuvenescimento" },
      },
      required: ["clientId", "professionalId", "name", "value"],
    },
  })
  @ApiCreatedResponse({
    description: "Procedure successfully created.",
  })
  @ApiBadRequestResponse({ description: "Invalid or malformed body." })
  @ApiConflictResponse({ description: "Related entities not found or conflict data." })
  @ApiInternalServerErrorResponse({ description: "Unexpected server error." })
  @UsePipes(new ZodValidationPipe(createProcedureBodySchema))
  async handle(@Body() body: CreateProcedureBodySchema) {
    const result = await this.createProcedure.execute(body);

    if (isLeft(result)) {
      const error = unwrapEither(result);
      switch (error.constructor) {
        case UserNotFoundError:
          throw new ConflictException(error.message);
        case ProfessionalNotFoundError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { procedure } = unwrapEither(result);
    return { procedure: ProcedurePresenter.toHTTP(procedure) };
  }
}
