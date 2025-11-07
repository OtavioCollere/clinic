import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Put,
  UsePipes,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
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
import { ProfessionalNotFoundError } from "@/core/errors/professional-not-found-error";
import { InvalidDurationError } from "@/core/errors/invalid-duration-error";
import { AppointmentNotFoundError } from "@/core/errors/appointment-not-foundd-error";
import { EditAppointmentUseCase } from "@/domain/application/use-cases/appointments/edit-appointment";
import { AppointmentPresenter } from "../../presenters/appointments-presenter";

/**
 * Zod schema for validation
 */
const editAppointmentBodySchema = z.object({
  appointmentId: z.string().uuid("Invalid appointmentId format."),
  clientId: z.string().uuid("Invalid clientId format."),
  professionalId: z.string().uuid("Invalid professionalId format."),
  name: z.string(),
  duration: z.coerce.number(),
  description: z.string().optional(),
  dateHour: z.date(),
});

type EditAppointmentBodySchema = z.infer<typeof editAppointmentBodySchema>;

@ApiTags("Appointments")
@Controller("/appointment")
@Public()
export class EditAppointmentController {
  constructor(private editAppointment: EditAppointmentUseCase) {}

  @Put("/edit")
  @HttpCode(200)
  @ApiOperation({
    summary: "Edit an existing appointment",
    description:
      "Updates an existing appointment with new details. Requires appointmentId, clientId, professionalId, name, duration, and dateHour.",
  })
  @ApiBody({
    description: "Appointment data required to edit an existing appointment.",
    schema: {
      type: "object",
      required: ["appointmentId", "clientId", "professionalId", "name", "duration", "dateHour"],
      properties: {
        appointmentId: {
          type: "string",
          format: "uuid",
          example: "f65b2e34-1fcd-45b2-8a4e-9a11f01b7df5",
        },
        clientId: {
          type: "string",
          format: "uuid",
          example: "e4eaaaf2-d142-11e1-b3e4-080027620cdd",
        },
        professionalId: {
          type: "string",
          format: "uuid",
          example: "d3d94468-2fcd-45a3-9a4e-234b3a4422aa",
        },
        name: { type: "string", example: "Therapy session" },
        duration: { type: "number", example: 60 },
        description: { type: "string", example: "Follow-up appointment" },
        dateHour: { type: "string", format: "date-time", example: "2025-11-07T14:00:00.000Z" },
      },
    },
  })
  @ApiOkResponse({
    description: "Appointment successfully updated.",
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
            description: { type: "string", example: "Updated notes" },
            dateHour: { type: "string", example: "2025-11-07T14:00:00.000Z" },
            createdAt: { type: "string", example: "2025-10-10T00:00:00.000Z" },
            updatedAt: { type: "string", example: "2025-11-05T12:00:00.000Z" },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: "The provided appointmentId or clientId does not exist.",
    schema: {
      example: {
        statusCode: 404,
        message: "Appointment not found",
        error: "Not Found",
      },
    },
  })
  @ApiConflictResponse({
    description:
      "Conflict with existing data (e.g., overlapping schedule or professional not found).",
    schema: {
      example: {
        statusCode: 409,
        message: "Invalid duration or conflicting appointment.",
        error: "Conflict",
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Invalid or malformed request body.",
    schema: {
      example: {
        statusCode: 400,
        message: "Invalid request body format.",
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
  @UsePipes(new ZodValidationPipe(editAppointmentBodySchema))
  async handle(@Body() body: EditAppointmentBodySchema) {
    const { appointmentId, clientId, professionalId, name, duration, description, dateHour } = body;

    const result = await this.editAppointment.execute({
      appointmentId,
      clientId,
      professionalId,
      name,
      duration,
      description,
      dateHour,
    });

    if (isLeft(result)) {
      const error = unwrapEither(result);

      switch (error.constructor) {
        case AppointmentNotFoundError:
          throw new NotFoundException(error.message);
        case UserNotFoundError:
          throw new NotFoundException(error.message);
        case ProfessionalNotFoundError:
          throw new ConflictException(error.message);
        case InvalidDurationError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { appointment } = unwrapEither(result);
    return { appointment: AppointmentPresenter.toHTTP(appointment) };
  }
}
