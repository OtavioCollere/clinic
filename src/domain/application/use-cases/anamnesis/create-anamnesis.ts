import { makeLeft, makeRight, type Either } from "@/core/either/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Anamnesis } from "@/domain/enterprise/entities/anamnesis";
import type { AnamnesisRepository } from "../../repositories/anamnesis-repository";
import type { UsersRepository } from "../../repositories/users-repository";
import { UserNotFoundError } from "@/core/errors/user-not-found-error";

interface CreateAnamnesisUseCaseRequest {
  clientId: string;

  // --- Aesthetic history ---
  hadPreviousAestheticTreatment: boolean;
  botulinumToxin: boolean;
  botulinumRegion?: string;
  filler: boolean;
  fillerRegion?: string;
  fillerProduct?: string;
  suspensionThreads: boolean;
  suspensionThreadsRegion?: string;
  suspensionThreadsProduct?: string;
  surgicalLift: boolean;
  surgicalLiftRegion?: string;
  surgicalLiftProduct?: string;
  chemicalPeeling: boolean;
  chemicalPeelingRegion?: string;
  chemicalPeelingProduct?: string;
  laser: boolean;
  laserRegion?: string;
  laserProduct?: string;
  exposedToHeatOrColdWork: boolean;

  // --- Health conditions & habits ---
  smoker: boolean;
  circulatoryDisorder: boolean;
  epilepsy: boolean;
  regularMenstrualCycle: boolean;
  regularIntestinalFunction: boolean;
  cardiacAlterations: boolean;
  hormonalDisorder: boolean;
  hypoOrHypertension: boolean;
  renalDisorder: boolean;
  varicoseVeinsOrLesions: boolean;
  pregnant: boolean;
  gestationalWeeks?: number;
  underMedicalTreatment: boolean;
  medicalTreatmentDetails?: string;

  // --- Allergies, diseases, medications ---
  usesMedication: boolean;
  medicationDetails?: string;
  allergy: boolean;
  allergyDetails?: string;
  lactoseIntolerance: boolean;
  diabetes: "controlled" | "yes" | "no" | null;
  roacutan: boolean;

  // --- Additional medical history ---
  recentSurgery: boolean;
  recentSurgeryDetails?: string;
  tumorOrPrecancerousLesion: boolean;
  tumorOrLesionDetails?: string;
  skinProblems: boolean;
  skinProblemsDetails?: string;
  orthopedicProblems: boolean;
  orthopedicProblemsDetails?: string;
  hasBodyOrFacialProsthesis: boolean;
  prosthesisDetails?: string;
  usingAcids: boolean;
  acidsDetails?: string;
  otherRelevantIssues?: string;

  // --- Measurements ---
  bloodPressure?: string;
  height?: number;
  initialWeight?: number;
  finalWeight?: number;
}

type CreateAnamnesisUseCaseResponse = Either<
  UserNotFoundError,
  {
    anamnesis: Anamnesis;
  }
>;

export class CreateAnamnesisUseCase {
  constructor(
    private anamnesisRepository: AnamnesisRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute(request: CreateAnamnesisUseCaseRequest): Promise<CreateAnamnesisUseCaseResponse> {
    const { clientId } = request;

    const userExists = await this.usersRepository.findById(clientId);

    if (!userExists) {
      return makeLeft(new UserNotFoundError());
    }

    const anamnesis = Anamnesis.create({
      clientId: new UniqueEntityID(clientId),

      hadPreviousAestheticTreatment: request.hadPreviousAestheticTreatment,
      botulinumToxin: request.botulinumToxin,
      botulinumRegion: request.botulinumRegion,
      filler: request.filler,
      fillerRegion: request.fillerRegion,
      fillerProduct: request.fillerProduct,
      suspensionThreads: request.suspensionThreads,
      suspensionThreadsRegion: request.suspensionThreadsRegion,
      suspensionThreadsProduct: request.suspensionThreadsProduct,
      surgicalLift: request.surgicalLift,
      surgicalLiftRegion: request.surgicalLiftRegion,
      surgicalLiftProduct: request.surgicalLiftProduct,
      chemicalPeeling: request.chemicalPeeling,
      chemicalPeelingRegion: request.chemicalPeelingRegion,
      chemicalPeelingProduct: request.chemicalPeelingProduct,
      laser: request.laser,
      laserRegion: request.laserRegion,
      laserProduct: request.laserProduct,
      exposedToHeatOrColdWork: request.exposedToHeatOrColdWork,

      smoker: request.smoker,
      circulatoryDisorder: request.circulatoryDisorder,
      epilepsy: request.epilepsy,
      regularMenstrualCycle: request.regularMenstrualCycle,
      regularIntestinalFunction: request.regularIntestinalFunction,
      cardiacAlterations: request.cardiacAlterations,
      hormonalDisorder: request.hormonalDisorder,
      hypoOrHypertension: request.hypoOrHypertension,
      renalDisorder: request.renalDisorder,
      varicoseVeinsOrLesions: request.varicoseVeinsOrLesions,
      pregnant: request.pregnant,
      gestationalWeeks: request.gestationalWeeks,
      underMedicalTreatment: request.underMedicalTreatment,
      medicalTreatmentDetails: request.medicalTreatmentDetails,

      usesMedication: request.usesMedication,
      medicationDetails: request.medicationDetails,
      allergy: request.allergy,
      allergyDetails: request.allergyDetails,
      lactoseIntolerance: request.lactoseIntolerance,
      diabetes: request.diabetes,
      roacutan: request.roacutan,

      recentSurgery: request.recentSurgery,
      recentSurgeryDetails: request.recentSurgeryDetails,
      tumorOrPrecancerousLesion: request.tumorOrPrecancerousLesion,
      tumorOrLesionDetails: request.tumorOrLesionDetails,
      skinProblems: request.skinProblems,
      skinProblemsDetails: request.skinProblemsDetails,
      orthopedicProblems: request.orthopedicProblems,
      orthopedicProblemsDetails: request.orthopedicProblemsDetails,
      hasBodyOrFacialProsthesis: request.hasBodyOrFacialProsthesis,
      prosthesisDetails: request.prosthesisDetails,
      usingAcids: request.usingAcids,
      acidsDetails: request.acidsDetails,
      otherRelevantIssues: request.otherRelevantIssues,

      bloodPressure: request.bloodPressure,
      height: request.height,
      initialWeight: request.initialWeight,
      finalWeight: request.finalWeight,
    });

    await this.anamnesisRepository.create(anamnesis);

    return makeRight({ anamnesis });
  }
}
