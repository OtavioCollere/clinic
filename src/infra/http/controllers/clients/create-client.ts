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
import { CreateClientUseCase } from "@/domain/application/use-cases/client/create-client";
import { UserNotFoundError } from "@/core/errors/user-not-found-error";
import { CpfAlreadyExistsError } from "@/core/errors/cpf-already-exists-error";
import { ClientPresenter } from "../../presenters/client-presenter";

/**
 * Zod schema for input validation and type inference.
 * Self-contained and used only within this controller.
 */
const createClientBodySchema = z.object({
  clientId: z.string().uuid("Invalid clientId format."),
  address: z.string().min(1, "Address is required."),
  phone: z.string().min(8).max(15, "Phone must have between 8 and 15 digits."),
  birthDate: z.coerce.date(),
  cpf: z.string().min(11).max(11, "CPF must have 11 digits."),
  profession: z.string().min(1, "Profession is required."),
  emergencyPhone: z.string().min(8).max(15).optional(),
  notes: z.string().optional(),
});

type CreateClientBodySchema = z.infer<typeof createClientBodySchema>;

@ApiTags("Clients")
@Controller("/clients")
@Public()
export class CreateClientController {
  constructor(private createClient: CreateClientUseCase) {}

  @Post("/create")
  @HttpCode(201)
  @ApiOperation({
    summary: "Create a new client",
    description:
      "Registers a new client linked to a valid user. Requires clientId, address, phone, birthDate, CPF, and profession. " +
      "If the provided user or CPF already exists, appropriate errors are returned.",
  })
  @ApiBody({
    description: "Client data required to create a new client record.",
    schema: {
      type: "object",
      required: ["clientId", "address", "phone", "birthDate", "cpf", "profession"],
      properties: {
        clientId: {
          type: "string",
          format: "uuid",
          example: "e4eaaaf2-d142-11e1-b3e4-080027620cdd",
        },
        address: { type: "string", example: "123 Main Street" },
        phone: { type: "string", example: "41996335822" },
        birthDate: { type: "string", format: "date-time", example: "2003-10-16T00:00:00.000Z" },
        cpf: { type: "string", example: "08898972771" },
        profession: { type: "string", example: "Developer" },
        emergencyPhone: { type: "string", example: "41999998888" },
        notes: { type: "string", example: "Client referred by another professional." },
      },
    },
  })
  @ApiCreatedResponse({
    description: "Client successfully created.",
    schema: {
      type: "object",
      properties: {
        client: {
          type: "object",
          properties: {
            id: { type: "string", example: "uuid" },
            clientId: { type: "string", example: "uuid" },
            address: { type: "string", example: "123 Main Street" },
            phone: { type: "string", example: "41996335822" },
            birthDate: { type: "string", example: "2003-10-16T00:00:00.000Z" },
            cpf: { type: "string", example: "08898972771" },
            profession: { type: "string", example: "Developer" },
            emergencyPhone: { type: "string", example: "41999998888" },
            notes: { type: "string", example: "Test client notes" },
            createdAt: { type: "string", example: "2025-11-02T00:00:00.000Z" },
            updatedAt: { type: "string", nullable: true, example: null },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: "The provided clientId does not exist.",
    schema: {
      example: {
        statusCode: 404,
        message: "User not found",
        error: "Not Found",
      },
    },
  })
  @ApiConflictResponse({
    description: "CPF already exists in the system.",
    schema: {
      example: {
        statusCode: 409,
        message: "CPF already exists",
        error: "Conflict",
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Invalid or malformed request body.",
    schema: {
      example: {
        statusCode: 400,
        message: "Invalid CPF format.",
        error: "Bad Request",
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: "Unexpected server error.",
    schema: {
      example: {
        statusCode: 500,
        message: "Internal server error",
        error: "Internal Server Error",
      },
    },
  })
  @UsePipes(new ZodValidationPipe(createClientBodySchema))
  async handle(@Body() body: CreateClientBodySchema) {
    const { clientId, address, phone, birthDate, cpf, profession, emergencyPhone, notes } = body;

    const result = await this.createClient.execute({
      clientId,
      address,
      phone,
      birthDate,
      cpf,
      profession,
      emergencyPhone,
      notes,
    });

    if (isLeft(result)) {
      const error = unwrapEither(result);

      switch (error.constructor) {
        case UserNotFoundError:
          throw new NotFoundException(error.message);
        case CpfAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { client } = unwrapEither(result);
    return { client: ClientPresenter.toHTTP(client) };
  }
}
