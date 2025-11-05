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
import { ProfessionalPresenter } from "../../presenters/professional-presenter";
import type { ListProfessionalUseCase } from "@/domain/application/use-cases/professionals/list-professional";

const listProfessionalsQuerySchema = z.object({
  page: z.coerce.number().min(1),
  pageSize: z.coerce.number().min(1).max(100),
  query: z.string().optional().default(""),
});

type ListProfessionalsQuerySchema = z.infer<typeof listProfessionalsQuerySchema>;

@ApiTags("Professionals")
@Controller("/professionals")
@Public()
export class ListProfessionalsController {
  constructor(private listProfessionals: ListProfessionalUseCase) {}

  @Get("/fetch")
  @HttpCode(200)
  @ApiOperation({
    summary: "Fetch professionals list",
    description: "Returns paginated professionals with optional query filtering.",
  })
  @ApiQuery({ name: "page", required: true, type: Number, example: 1 })
  @ApiQuery({ name: "pageSize", required: true, type: Number, example: 10 })
  @ApiQuery({ name: "query", required: false, type: String, example: "Dermato" })
  @ApiOkResponse({
    description: "List of professionals successfully retrieved.",
  })
  @ApiBadRequestResponse({
    description: "Invalid query parameters.",
  })
  @ApiInternalServerErrorResponse({
    description: "Unexpected server error.",
  })
  @UsePipes(new ZodValidationPipe(listProfessionalsQuerySchema))
  async handle(@Query() query: ListProfessionalsQuerySchema) {
    const { page, pageSize, query: search } = query;

    const result = await this.listProfessionals.execute({
      page,
      pageSize,
      query: search,
    });

    if (isLeft(result)) {
      const error = unwrapEither(result) as any;
      switch (error?.constructor) {
        default:
          throw new BadRequestException(error?.message || "Failed to fetch professionals.");
      }
    }

    const { professionals } = unwrapEither(result);
    return { professionals: professionals.map(ProfessionalPresenter.toHTTP) };
  }
}
