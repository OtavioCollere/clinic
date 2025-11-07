// src/infra/http/controllers/anamnesis/edit-anamnesis.ts
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Put,
  UsePipes,
  NotFoundException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiBody,
  ApiNotFoundResponse,
} from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { isLeft, unwrapEither } from "@/core/either/either";
import { Public } from "@/infra/auth/public";
import { EditAnamnesisUseCase } from "@/domain/application/use-cases/anamnesis/edit-anamnesis";
import { AnamnesisNotFoundError } from "@/core/errors/anamnesis-not-found-error";
import { AnamnesisPresenter } from "../../presenters/anamnesis-presenter";

// Todos opcionais, mais o ID:
const editAnamnesisBodySchema = z.object({
  anamnesisId: z.string().uuid("Invalid anamnesisId format."),
  // abaixo todos opcionais
  hadPreviousAestheticTreatment: z.boolean().optional(),
  botulinumToxin: z.boolean().optional(),
  botulinumRegion: z.string().optional(),
  filler: z.boolean().optional(),
  fillerRegion: z.string().optional(),
  fillerProduct: z.string().optional(),
  suspensionThreads: z.boolean().optional(),
  suspensionThreadsRegion: z.string().optional(),
  suspensionThreadsProduct: z.string().optional(),
  surgicalLift: z.boolean().optional(),
  surgicalLiftRegion: z.string().optional(),
  surgicalLiftProduct: z.string().optional(),
  chemicalPeeling: z.boolean().optional(),
  chemicalPeelingRegion: z.string().optional(),
  chemicalPeelingProduct: z.string().optional(),
  laser: z.boolean().optional(),
  laserRegion: z.string().optional(),
  laserProduct: z.string().optional(),
  exposedToHeatOrColdWork: z.boolean().optional(),

  smoker: z.boolean().optional(),
  circulatoryDisorder: z.boolean().optional(),
  epilepsy: z.boolean().optional(),
  regularMenstrualCycle: z.boolean().optional(),
  regularIntestinalFunction: z.boolean().optional(),
  cardiacAlterations: z.boolean().optional(),
  hormonalDisorder: z.boolean().optional(),
  hypoOrHypertension: z.boolean().optional(),
  renalDisorder: z.boolean().optional(),
  varicoseVeinsOrLesions: z.boolean().optional(),
  pregnant: z.boolean().optional(),
  gestationalWeeks: z.coerce.number().optional(),
  underMedicalTreatment: z.boolean().optional(),
  medicalTreatmentDetails: z.string().optional(),

  usesMedication: z.boolean().optional(),
  medicationDetails: z.string().optional(),
  allergy: z.boolean().optional(),
  allergyDetails: z.string().optional(),
  lactoseIntolerance: z.boolean().optional(),
  diabetes: z.enum(["controlled", "yes", "no"]).nullable().optional(),
  roacutan: z.boolean().optional(),

  recentSurgery: z.boolean().optional(),
  recentSurgeryDetails: z.string().optional(),
  tumorOrPrecancerousLesion: z.boolean().optional(),
  tumorOrLesionDetails: z.string().optional(),
  skinProblems: z.boolean().optional(),
  skinProblemsDetails: z.string().optional(),
  orthopedicProblems: z.boolean().optional(),
  orthopedicProblemsDetails: z.string().optional(),
  hasBodyOrFacialProsthesis: z.boolean().optional(),
  prosthesisDetails: z.string().optional(),
  usingAcids: z.boolean().optional(),
  acidsDetails: z.string().optional(),
  otherRelevantIssues: z.string().optional(),

  bloodPressure: z.string().optional(),
  height: z.coerce.number().optional(),
  initialWeight: z.coerce.number().optional(),
  finalWeight: z.coerce.number().optional(),
});

type EditAnamnesisBodySchema = z.infer<typeof editAnamnesisBodySchema>;

@ApiTags("Anamnesis")
@Controller("/anamnesis")
@Public()
export class EditAnamnesisController {
  constructor(private editAnamnesis: EditAnamnesisUseCase) {}

  @Put("/edit")
  @HttpCode(200)
  @ApiOperation({ summary: "Edit an existing anamnesis" })
  @ApiOkResponse({ description: "Anamnesis successfully updated." })
  @ApiNotFoundResponse({ description: "Anamnesis not found." })
  @ApiBadRequestResponse({ description: "Invalid request body." })
  @ApiInternalServerErrorResponse({ description: "Unexpected server error." })
  @ApiBody({ schema: { type: "object" } })
  @UsePipes(new ZodValidationPipe(editAnamnesisBodySchema))
  async handle(@Body() body: EditAnamnesisBodySchema) {
    const result = await this.editAnamnesis.execute(body);

    if (isLeft(result)) {
      const error = unwrapEither(result);
      switch (error.constructor) {
        case AnamnesisNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { anamnesis } = unwrapEither(result);
    return { anamnesis: AnamnesisPresenter.toHTTP(anamnesis) };
  }
}
