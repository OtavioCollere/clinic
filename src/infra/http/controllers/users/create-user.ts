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
import { CreateUserUseCase } from "@/domain/application/use-cases/users/create-user";
import { isLeft, unwrapEither } from "@/core/either/either";
import { EmailAlreadyExistsError } from "@/core/errors/email-already-exists-error";
import { UserPresenter } from "../../presenters/user-presenter";
import { Public } from "@/infra/auth/public";

/**
 * Zod schema for input validation and type inference.
 * Self-contained, used only in this controller.
 */
const createUserControllerBodySchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Invalid email format."),
  password: z.string().min(6, "Password must have at least 6 characters."),
  role: z.enum(["USER", "ADMIN"]).default("USER"),
});

type CreateUserControllerBodySchema = z.infer<typeof createUserControllerBodySchema>;

@ApiTags("Users")
@Controller("/users")
@Public()
export class CreateUserController {
  constructor(private createUser: CreateUserUseCase) {}

  @Post("/create")
  @HttpCode(201)
  @ApiOperation({
    summary: "Create a new user",
    description:
      "Registers a new user in the system. Requires name, email, password, and optional role. " +
      "If the provided email already exists, a 409 Conflict is returned.",
  })
  @ApiBody({
    description: "User data required to create a new account.",
    schema: {
      type: "object",
      required: ["name", "email", "password"],
      properties: {
        name: { type: "string", example: "John Doe" },
        email: { type: "string", example: "john@example.com" },
        password: { type: "string", example: "123456" },
        role: { type: "string", enum: ["USER", "ADMIN"], example: "USER" },
      },
    },
  })
  @ApiCreatedResponse({
    description: "User successfully created.",
    schema: {
      type: "object",
      properties: {
        user: {
          type: "object",
          properties: {
            id: { type: "string", example: "uuid" },
            name: { type: "string", example: "John Doe" },
            email: { type: "string", example: "john@example.com" },
            role: { type: "string", example: "USER" },
            createdAt: { type: "string", example: "2025-11-02T00:00:00.000Z" },
          },
        },
      },
    },
  })
  @ApiConflictResponse({
    description: "Email already exists in the system.",
    schema: {
      example: {
        statusCode: 409,
        message: "Email already exists",
        error: "Conflict",
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Invalid or malformed request body.",
    schema: {
      example: {
        statusCode: 400,
        message: "Invalid email format",
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
  @UsePipes(new ZodValidationPipe(createUserControllerBodySchema))
  async handle(@Body() body: CreateUserControllerBodySchema) {
    const { name, email, password, role } = body;

    const result = await this.createUser.execute({ name, email, password, role });

    if (isLeft(result)) {
      const error = unwrapEither(result);

      switch (error.constructor) {
        case EmailAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { user } = unwrapEither(result);
    return { user: UserPresenter.toHTTP(user) };
  }
}
