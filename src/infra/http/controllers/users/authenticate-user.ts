import type { AuthenticateUseCase } from '@/domain/application/use-cases/users/authenticate-user';
import { Public } from '@/infra/auth/public';
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import z from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe';
import { isLeft, unwrapEither } from '@/core/either/either';
import { WrongCredentialsError } from '@/core/errors/wrong-credentials-error';


const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(), // alinhe com a política real; evite mismatch com Swagger
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller('/sessions')
@ApiTags('Auth')
@Public()
export class AuthenticateController {
  constructor(private authenticateUser: AuthenticateUseCase) {}

  @ApiOperation({ summary: 'Authenticate a user and return JWT tokens' })
  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  @ApiBody({
    description: 'Credentials for authentication',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email', example: 'otavio@email.com' },
        password: { type: 'string', minLength: 8, example: '1234' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiOkResponse({
    description: 'Authenticated successfully',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', description: 'JWT access token' },
        refresh_token: { type: 'string', description: 'JWT refresh token' },
      },
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    schema: {
      example: {
        statusCode: 401,
        message: 'Wrong credentials',
        error: 'Unauthorized',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation error (Zod) or other bad request',
    schema: {
      example: {
        statusCode: 400,
        message: [
          { path: ['password'], message: 'String must contain at least 8 character(s)' },
        ],
        error: 'Bad Request',
      },
    },
  })
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body;

    const result = await this.authenticateUser.execute({ email, password });

    if (isLeft(result)) {
      const error = unwrapEither(result);
      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException();
      }
    }

    const { access_token, refresh_token } = unwrapEither(result);
    return { access_token, refresh_token };
  }
}