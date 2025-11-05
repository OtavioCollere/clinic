import { BadRequestException, Controller, Get, HttpCode, Query, UsePipes } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { isLeft, unwrapEither } from "@/core/either/either";
import { Public } from "@/infra/auth/public";
import type { FetchAppointmentsUseCase } from "@/domain/application/use-cases/appointments/fetch-appointments";
import { AppointmentPresenter } from "../../presenters/appointments-presenter";

/**
 * Zod schema for query params validation
 */
const fetchAppointmentsQuerySchema = z.object({
  page: z.coerce.number().min(1, "Page must be at least 1"),
  pageSize: z.coerce.number().min(1).max(100, "PageSize max is 100"),
  query: z.string().optional().default(""),
});

type FetchAppointmentsQuerySchema = z.infer<typeof fetchAppointmentsQuerySchema>;

@ApiTags("Appointments")
@Controller("/appointment")
@Public()
export class FetchAppointmentsController {
  constructor(private fetchAppointments: FetchAppointmentsUseCase) {}

  @Get("/fetch")
  @HttpCode(200)
  @ApiOperation({
    summary: "Fetch appointments list",
    description:
      "Retrieves a paginated list of appointments. Allows optional search filtering via query string.",
  })
  @ApiQuery({ name: "page", required: true, type: Number, example: 1 })
  @ApiQuery({ name: "pageSize", required: true, type: Number, example: 10 })
  @ApiQuery({ name: "query", required: false, type: String, example: "Therapy" })
  @ApiOkResponse({
    description: "List of appointments successfully fetched.",
    schema: {
      type: "object",
      properties: {
        appointments: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string", example: "uuid" },
              clientId: { type: "string", example: "uuid" },
              professionalId: { type: "string", example: "uuid" },
              name: { type: "string", example: "Therapy session" },
              duration: { type: "number", example: 60 },
              dateHour: { type: "string", example: "2025-11-07T14:00:00.000Z" },
              createdAt: { type: "string", example: "2025-10-10T00:00:00.000Z" },
              updatedAt: { type: "string", example: "2025-11-05T12:00:00.000Z" },
            },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Invalid or malformed query parameters.",
    schema: {
      example: {
        statusCode: 400,
        message: "Invalid page or pageSize.",
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
  @UsePipes(new ZodValidationPipe(fetchAppointmentsQuerySchema))
  async handle(@Query() query: FetchAppointmentsQuerySchema) {
    const { page, pageSize, query: search } = query;

    const result = await this.fetchAppointments.execute({
      page,
      pageSize,
      query: search,
    });

    if (isLeft(result)) {
      const error = unwrapEither(result) as any; // 👈 força tipo genérico

      switch (error?.constructor) {
        default:
          throw new BadRequestException(error?.message || "Failed to fetch appointments.");
      }
    }

    const { appointments } = unwrapEither(result);
    return { appointments: appointments.map(AppointmentPresenter.toHTTP) };
  }
}
