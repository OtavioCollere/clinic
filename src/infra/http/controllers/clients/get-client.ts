import { Controller, Get, HttpCode, NotFoundException, Param } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from "@nestjs/swagger";
import { isLeft, unwrapEither } from "@/core/either/either";
import { Public } from "@/infra/auth/public";
import type { GetClientUseCase } from "@/domain/application/use-cases/client/get-client";
import { ClientNotFoundError } from "@/core/errors/client-not-found-error";
import { ClientPresenter } from "../../presenters/client-presenter";

/**
 * Controller responsible for retrieving a single client by ID.
 */
@ApiTags("Clients")
@Controller("/clients")
@Public()
export class GetClientController {
  constructor(private getClient: GetClientUseCase) {}

  @Get("/:id")
  @HttpCode(200)
  @ApiOperation({
    summary: "Retrieve a client by ID",
    description: "Fetches a single client using its unique identifier.",
  })
  @ApiOkResponse({
    description: "Client successfully retrieved.",
    schema: {
      type: "object",
      properties: {
        client: {
          type: "object",
          properties: {
            id: { type: "string", example: "uuid" },
            userId: { type: "string", example: "uuid" },
            address: { type: "string", example: "123 Main Street" },
            phone: { type: "string", example: "41996335822" },
            birthDate: { type: "string", example: "2003-10-16T00:00:00.000Z" },
            cpf: { type: "string", example: "08898972771" },
            profession: { type: "string", example: "Developer" },
            emergencyPhone: { type: "string", example: "41999998888" },
            notes: { type: "string", example: "Client notes" },
            createdAt: { type: "string", example: "2025-11-02T00:00:00.000Z" },
            updatedAt: { type: "string", example: null },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: "Client not found.",
    schema: {
      example: {
        statusCode: 404,
        message: "Client not found",
        error: "Not Found",
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
  async handle(@Param("id") id: string) {
    const result = await this.getClient.execute({ clientId: id });

    if (isLeft(result)) {
      const error = unwrapEither(result);

      switch (error.constructor) {
        case ClientNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new Error(error.message);
      }
    }

    const { client } = unwrapEither(result);
    return { client: ClientPresenter.toHTTP(client) };
  }
}
