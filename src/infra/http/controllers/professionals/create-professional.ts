import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
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
  ApiNotFoundResponse,
} from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { isLeft, unwrapEither } from "@/core/either/either";
import { Public } from "@/infra/auth/public";
import { UserNotFoundError } from "@/core/errors/user-not-found-error";
import { LicenseNumberAlreadyExistsError } from "@/core/errors/license-number-already-exists-error";
import type { CreateProfessionalUseCase } from "@/domain/application/use-cases/professionals/create-professional";
import { ProfessionalPresenter } from "../../presenters/professional-presenter";

const createProfessionalBodySchema = z.object({
  clientId: z.string().uuid("Invalid clientId format."),
  type: z.enum(["MEDICO", "BIOMEDICO", "ODONTO"]),
  licenseNumber: z.string().min(3),
  description: z.string().optional(),
});

type CreateProfessionalBodySchema = z.infer<typeof createProfessionalBodySchema>;

@ApiTags("Professionals")
@Controller("/professionals")
@Public()
export class CreateProfessionalController {
  constructor(private createProfessional: CreateProfessionalUseCase) {}

  @Post("/create")
  @HttpCode(201)
  @ApiOperation({
    summary: "Create a new professional",
    description:
      "Registers a professional linked to a user. Validates unique license number and user existence.",
  })
  @ApiBody({
    description: "Professional creation payload.",
    schema: {
      type: "object",
      required: ["clientId", "type", "licenseNumber"],
      properties: {
        clientId: { type: "string", format: "uuid" },
        type: { type: "string", enum: ["MEDICO", "BIOMEDICO", "ODONTO"] },
        licenseNumber: { type: "string", example: "CRM12345" },
        description: { type: "string", example: "Dermatologista" },
      },
    },
  })
  @ApiCreatedResponse({
    description: "Professional successfully created.",
  })
  @ApiNotFoundResponse({
    description: "User not found.",
  })
  @ApiConflictResponse({
    description: "License number already exists.",
  })
  @ApiBadRequestResponse({
    description: "Invalid request body.",
  })
  @ApiInternalServerErrorResponse({
    description: "Unexpected server error.",
  })
  @UsePipes(new ZodValidationPipe(createProfessionalBodySchema))
  async handle(@Body() body: CreateProfessionalBodySchema) {
    const { clientId, type, licenseNumber, description } = body;

    const result = await this.createProfessional.execute({
      clientId,
      type,
      licenseNumber,
      description,
    });

    if (isLeft(result)) {
      const error = unwrapEither(result);

      switch (error.constructor) {
        case UserNotFoundError:
          throw new NotFoundException(error.message);
        case LicenseNumberAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { professional } = unwrapEither(result);
    return { professional: ProfessionalPresenter.toHTTP(professional) };
  }
}
