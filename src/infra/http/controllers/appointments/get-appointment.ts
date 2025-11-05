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
import { AppointmentNotFoundError } from "@/core/errors/appointment-not-foundd-error";
import { AppointmentPresenter } from "../../presenters/appointments-presenter";
import type { GetAppointmentUseCase } from "@/domain/application/use-cases/appointments/get-appointments";

/**
 * Zod schema for param validation
 */
const getAppointmentParamSchema = z.object({
  appointmentId: z.string().uuid("Invalid appointmentId format."),
});

type GetAppointmentParamSchema = z.infer<typeof getAppointmentParamSchema>;

@ApiTags("Appointments")
@Controller("/appointment")
@Public()
export class GetAppointmentController {
  constructor(private getAppointment: GetAppointmentUseCase) {}

  @Get("/:appointmentId")
  @HttpCode(200)
  @ApiOperation({
    summary: "Get a specific appointment by ID",
    description: "Retrieves details of a specific appointment using its unique identifier.",
  })
  @ApiParam({
    name: "appointmentId",
    required: true,
    description: "The ID of the appointment to retrieve.",
    example: "f65b2e34-1fcd-45b2-8a4e-9a11f01b7df5",
  })
  @ApiOkResponse({
    description: "Appointment successfully retrieved.",
    schema: {
      type: "object",
      properties: {
        appointment: {
          type: "object",
          properties: {
            id: { type: "string", example: "uuid" },
            clientId: { type: "string", example: "uuid" },
            professionalId: { type: "string", example: "uuid" },
            name: { type: "string", example: "Therapy session" },
            duration: { type: "number", example: 60 },
            description: { type: "string", example: "Follow-up appointment" },
            dateHour: { type: "string", example: "2025-11-07T14:00:00.000Z" },
            createdAt: { type: "string", example: "2025-10-10T00:00:00.000Z" },
            updatedAt: { type: "string", example: "2025-11-05T12:00:00.000Z" },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: "The provided appointmentId does not exist.",
    schema: {
      example: {
        statusCode: 404,
        message: "Appointment not found",
        error: "Not Found",
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Invalid or malformed request.",
    schema: {
      example: {
        statusCode: 400,
        message: "Invalid appointmentId format.",
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
  @UsePipes(new ZodValidationPipe(getAppointmentParamSchema))
  async handle(@Param() params: GetAppointmentParamSchema) {
    const { appointmentId } = params;

    const result = await this.getAppointment.execute({
      appointmentId,
    });

    if (isLeft(result)) {
      const error = unwrapEither(result);

      switch (error.constructor) {
        case AppointmentNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { appointment } = unwrapEither(result);
    return { appointment: AppointmentPresenter.toHTTP(appointment) };
  }
}
