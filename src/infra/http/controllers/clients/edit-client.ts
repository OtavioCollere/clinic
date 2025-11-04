import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  UsePipes,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { isLeft, unwrapEither } from "@/core/either/either";
import { Public } from "@/infra/auth/public";
import { EditClientUseCase } from "@/domain/application/use-cases/client/edit-client";
import { UserNotFoundError } from "@/core/errors/user-not-found-error";
import { ClientNotFoundError } from "@/core/errors/client-not-found-error";
import { ClientPresenter } from "../../presenters/client-presenter";

/**
 * Zod schema for editing an existing client.
 */
const editClientBodySchema = z.object({
  userId: z.string().uuid("Invalid userId format."),
  address: z.string().min(1, "Address is required."),
  phone: z.string().min(8).max(15, "Phone must have between 8 and 15 digits."),
  birthDate: z.coerce.date(),
  cpf: z.string().min(11).max(11, "CPF must have 11 digits."),
  profession: z.string().min(1, "Profession is required."),
  emergencyPhone: z.string().min(8).max(15).optional(),
  notes: z.string().optional(),
});

type EditClientBodySchema = z.infer<typeof editClientBodySchema>;

@ApiTags("Clients")
@Controller("/clients")
@Public()
export class EditClientController {
  constructor(private editClient: EditClientUseCase) {}

  @Patch("/edit/:id")
  @HttpCode(200)
  @ApiOperation({
    summary: "Edit an existing client",
    description:
      "Updates the details of an existing client. Requires clientId, userId, and valid data fields. " +
      "Returns 404 if the client or user does not exist.",
  })
  @ApiBody({
    description: "Client data for update.",
    schema: {
      type: "object",
      required: ["userId", "address", "phone", "birthDate", "cpf", "profession"],
      properties: {
        userId: { type: "string", example: "uuid" },
        address: { type: "string", example: "Rua Nova 456" },
        phone: { type: "string", example: "41999998888" },
        birthDate: { type: "string", example: "2003-10-16T00:00:00.000Z" },
        cpf: { type: "string", example: "09982792934" },
        profession: { type: "string", example: "Engineer" },
        emergencyPhone: { type: "string", example: "41988887777" },
        notes: { type: "string", example: "Updated client info" },
      },
    },
  })
  @ApiOkResponse({
    description: "Client successfully updated.",
  })
  @ApiNotFoundResponse({
    description: "Client or User not found.",
  })
  @ApiBadRequestResponse({
    description: "Invalid request body.",
  })
  @ApiInternalServerErrorResponse({
    description: "Unexpected server error.",
  })
  @UsePipes(new ZodValidationPipe(editClientBodySchema))
  async handle(@Param("id") id: string, @Body() body: EditClientBodySchema) {
    const { userId, address, phone, birthDate, cpf, profession, emergencyPhone, notes } = body;

    const result = await this.editClient.execute({
      clientId: id,
      userId,
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
        case ClientNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { client } = unwrapEither(result);
    return { client: ClientPresenter.toHTTP(client) };
  }
}
