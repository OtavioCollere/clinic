import { makeLeft, makeRight, type Either } from "@/core/either/either";
import { Anamnesis } from "@/domain/enterprise/entities/anamnesis";
import type { AnamnesisRepository } from "../../repositories/anamnesis-repository";
import { AnamnesisNotFoundError } from "@/core/errors/anamnesis-not-found-error";

interface EditAnamnesisUseCaseRequest {
  anamnesisId: string;

  // Campos atualizáveis — todos opcionais
  hadPreviousAestheticTreatment?: boolean;
  botulinumToxin?: boolean;
  botulinumRegion?: string;
  filler?: boolean;
  fillerRegion?: string;
  fillerProduct?: string;
  suspensionThreads?: boolean;
  suspensionThreadsRegion?: string;
  suspensionThreadsProduct?: string;
  surgicalLift?: boolean;
  surgicalLiftRegion?: string;
  surgicalLiftProduct?: string;
  chemicalPeeling?: boolean;
  chemicalPeelingRegion?: string;
  chemicalPeelingProduct?: string;
  laser?: boolean;
  laserRegion?: string;
  laserProduct?: string;
  exposedToHeatOrColdWork?: boolean;

  smoker?: boolean;
  circulatoryDisorder?: boolean;
  epilepsy?: boolean;
  regularMenstrualCycle?: boolean;
  regularIntestinalFunction?: boolean;
  cardiacAlterations?: boolean;
  hormonalDisorder?: boolean;
  hypoOrHypertension?: boolean;
  renalDisorder?: boolean;
  varicoseVeinsOrLesions?: boolean;
  pregnant?: boolean;
  gestationalWeeks?: number;
  underMedicalTreatment?: boolean;
  medicalTreatmentDetails?: string;

  usesMedication?: boolean;
  medicationDetails?: string;
  allergy?: boolean;
  allergyDetails?: string;
  lactoseIntolerance?: boolean;
  diabetes?: "controlled" | "yes" | "no" | null;
  roacutan?: boolean;

  recentSurgery?: boolean;
  recentSurgeryDetails?: string;
  tumorOrPrecancerousLesion?: boolean;
  tumorOrLesionDetails?: string;
  skinProblems?: boolean;
  skinProblemsDetails?: string;
  orthopedicProblems?: boolean;
  orthopedicProblemsDetails?: string;
  hasBodyOrFacialProsthesis?: boolean;
  prosthesisDetails?: string;
  usingAcids?: boolean;
  acidsDetails?: string;
  otherRelevantIssues?: string;

  bloodPressure?: string;
  height?: number;
  initialWeight?: number;
  finalWeight?: number;
}

type EditAnamnesisUseCaseResponse = Either<
  AnamnesisNotFoundError,
  {
    anamnesis: Anamnesis;
  }
>;

export class EditAnamnesisUseCase {
  constructor(private anamnesisRepository: AnamnesisRepository) {}

  async execute(request: EditAnamnesisUseCaseRequest): Promise<EditAnamnesisUseCaseResponse> {
    const anamnesis = await this.anamnesisRepository.findById(request.anamnesisId);

    if (!anamnesis) {
      return makeLeft(new AnamnesisNotFoundError());
    }

    Object.assign(anamnesis, {
      ...request,
      updatedAt: new Date(),
    });

    await this.anamnesisRepository.save(anamnesis);

    return makeRight({ anamnesis });
  }
}
