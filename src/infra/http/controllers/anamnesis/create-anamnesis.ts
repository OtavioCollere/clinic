// src/infra/http/controllers/anamnesis/create-anamnesis.ts
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
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiConflictResponse,
} from "@nestjs/swagger";
import z from "zod";
import { ZodValidationPipe } from "../../pipes/zod-validation-pipe";
import { isLeft, unwrapEither } from "@/core/either/either";
import { Public } from "@/infra/auth/public";
import type { CreateAnamnesisUseCase } from "@/domain/application/use-cases/anamnesis/create-anamnesis";
import { UserNotFoundError } from "@/core/errors/user-not-found-error";
import { AnamnesisPresenter } from "../../presenters/anamnesis-presenter";

// Campos obrigatórios mínimos para criar (o resto opcional)
const createAnamnesisBodySchema = z.object({
  clientId: z.string().uuid("Invalid clientId format."),
  // Aesthetic history (flags mínimas)
  hadPreviousAestheticTreatment: z.boolean(),
  botulinumToxin: z.boolean(),
  filler: z.boolean(),
  suspensionThreads: z.boolean(),
  surgicalLift: z.boolean(),
  chemicalPeeling: z.boolean(),
  laser: z.boolean(),
  exposedToHeatOrColdWork: z.boolean(),

  // Health
  smoker: z.boolean(),
  circulatoryDisorder: z.boolean(),
  epilepsy: z.boolean(),
  regularMenstrualCycle: z.boolean(),
  regularIntestinalFunction: z.boolean(),
  cardiacAlterations: z.boolean(),
  hormonalDisorder: z.boolean(),
  hypoOrHypertension: z.boolean(),
  renalDisorder: z.boolean(),
  varicoseVeinsOrLesions: z.boolean(),
  pregnant: z.boolean(),
  underMedicalTreatment: z.boolean(),

  // Allergies / meds / diseases
  usesMedication: z.boolean(),
  allergy: z.boolean(),
  lactoseIntolerance: z.boolean(),
  diabetes: z.enum(["controlled", "yes", "no"]).nullable().optional().default(null),
  roacutan: z.boolean(),

  recentSurgery: z.boolean(),
  tumorOrPrecancerousLesion: z.boolean(),
  skinProblems: z.boolean(),
  orthopedicProblems: z.boolean(),
  hasBodyOrFacialProsthesis: z.boolean(),
  usingAcids: z.boolean(),

  // opcionais
  botulinumRegion: z.string().optional(),
  fillerRegion: z.string().optional(),
  fillerProduct: z.string().optional(),
  suspensionThreadsRegion: z.string().optional(),
  suspensionThreadsProduct: z.string().optional(),
  surgicalLiftRegion: z.string().optional(),
  surgicalLiftProduct: z.string().optional(),
  chemicalPeelingRegion: z.string().optional(),
  chemicalPeelingProduct: z.string().optional(),
  laserRegion: z.string().optional(),
  laserProduct: z.string().optional(),

  gestationalWeeks: z.coerce.number().optional(),
  medicalTreatmentDetails: z.string().optional(),
  medicationDetails: z.string().optional(),
  allergyDetails: z.string().optional(),

  recentSurgeryDetails: z.string().optional(),
  tumorOrLesionDetails: z.string().optional(),
  skinProblemsDetails: z.string().optional(),
  orthopedicProblemsDetails: z.string().optional(),
  prosthesisDetails: z.string().optional(),
  acidsDetails: z.string().optional(),
  otherRelevantIssues: z.string().optional(),

  bloodPressure: z.string().optional(),
  height: z.coerce.number().optional(),
  initialWeight: z.coerce.number().optional(),
  finalWeight: z.coerce.number().optional(),
});

type CreateAnamnesisBodySchema = z.infer<typeof createAnamnesisBodySchema>;

@ApiTags("Anamnesis")
@Controller("/anamnesis")
@Public()
export class CreateAnamnesisController {
  constructor(private createAnamnesis: CreateAnamnesisUseCase) {}

  @Post("/create")
  @HttpCode(201)
  @ApiOperation({ summary: "Create a new anamnesis" })
  @ApiBody({ schema: { type: "object" } })
  @ApiCreatedResponse({ description: "Anamnesis successfully created." })
  @ApiConflictResponse({ description: "Client/user not found." })
  @ApiBadRequestResponse({ description: "Invalid or malformed body." })
  @ApiInternalServerErrorResponse({ description: "Unexpected server error." })
  @UsePipes(new ZodValidationPipe(createAnamnesisBodySchema))
  async handle(@Body() body: CreateAnamnesisBodySchema) {
    const result = await this.createAnamnesis.execute(body);

    if (isLeft(result)) {
      const error = unwrapEither(result);
      switch (error.constructor) {
        case UserNotFoundError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { anamnesis } = unwrapEither(result);
    return { anamnesis: AnamnesisPresenter.toHTTP(anamnesis) };
  }
}
