import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { Optional } from "@/core/types/optional";

export interface AnamnesisProps {
  userId: UniqueEntityID;

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

  createdAt: Date;
  updatedAt?: Date;
}

export class Anamnesis extends Entity<AnamnesisProps> {
  get userId() {
    return this.props.userId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: Optional<AnamnesisProps, "createdAt">, id?: UniqueEntityID) {
    const anamnesis = new Anamnesis(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return anamnesis;
  }
}
