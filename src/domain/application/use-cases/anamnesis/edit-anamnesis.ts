import { makeLeft, makeRight, type Either } from "@/core/either/either";
import { Anamnesis } from "@/domain/enterprise/entities/anamnesis";
import type { AnamnesisRepository } from "../../repositories/anamnesis-repository";
import { AnamnesisNotFoundError } from "@/core/errors/anamnesis-not-found-error";
import { Injectable } from "@nestjs/common";

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

@Injectable()
export class EditAnamnesisUseCase {
  constructor(private anamnesisRepository: AnamnesisRepository) {}

  async execute(request: EditAnamnesisUseCaseRequest): Promise<EditAnamnesisUseCaseResponse> {
    const anamnesis = await this.anamnesisRepository.findById(request.anamnesisId);

    if (!anamnesis) {
      return makeLeft(new AnamnesisNotFoundError());
    }

    // Remove anamnesisId from request to avoid overwriting the ID
    const { anamnesisId, ...updateData } = request;

    // Create a new Anamnesis instance with updated fields
    const updatedAnamnesis = Anamnesis.create(
      {
        clientId: anamnesis.clientId,
        hadPreviousAestheticTreatment: updateData.hadPreviousAestheticTreatment ?? anamnesis.hadPreviousAestheticTreatment,
        botulinumToxin: updateData.botulinumToxin ?? anamnesis.botulinumToxin,
        botulinumRegion: updateData.botulinumRegion ?? anamnesis.botulinumRegion,
        filler: updateData.filler ?? anamnesis.filler,
        fillerRegion: updateData.fillerRegion ?? anamnesis.fillerRegion,
        fillerProduct: updateData.fillerProduct ?? anamnesis.fillerProduct,
        suspensionThreads: updateData.suspensionThreads ?? anamnesis.suspensionThreads,
        suspensionThreadsRegion: updateData.suspensionThreadsRegion ?? anamnesis.suspensionThreadsRegion,
        suspensionThreadsProduct: updateData.suspensionThreadsProduct ?? anamnesis.suspensionThreadsProduct,
        surgicalLift: updateData.surgicalLift ?? anamnesis.surgicalLift,
        surgicalLiftRegion: updateData.surgicalLiftRegion ?? anamnesis.surgicalLiftRegion,
        surgicalLiftProduct: updateData.surgicalLiftProduct ?? anamnesis.surgicalLiftProduct,
        chemicalPeeling: updateData.chemicalPeeling ?? anamnesis.chemicalPeeling,
        chemicalPeelingRegion: updateData.chemicalPeelingRegion ?? anamnesis.chemicalPeelingRegion,
        chemicalPeelingProduct: updateData.chemicalPeelingProduct ?? anamnesis.chemicalPeelingProduct,
        laser: updateData.laser ?? anamnesis.laser,
        laserRegion: updateData.laserRegion ?? anamnesis.laserRegion,
        laserProduct: updateData.laserProduct ?? anamnesis.laserProduct,
        exposedToHeatOrColdWork: updateData.exposedToHeatOrColdWork ?? anamnesis.exposedToHeatOrColdWork,
        smoker: updateData.smoker ?? anamnesis.smoker,
        circulatoryDisorder: updateData.circulatoryDisorder ?? anamnesis.circulatoryDisorder,
        epilepsy: updateData.epilepsy ?? anamnesis.epilepsy,
        regularMenstrualCycle: updateData.regularMenstrualCycle ?? anamnesis.regularMenstrualCycle,
        regularIntestinalFunction: updateData.regularIntestinalFunction ?? anamnesis.regularIntestinalFunction,
        cardiacAlterations: updateData.cardiacAlterations ?? anamnesis.cardiacAlterations,
        hormonalDisorder: updateData.hormonalDisorder ?? anamnesis.hormonalDisorder,
        hypoOrHypertension: updateData.hypoOrHypertension ?? anamnesis.hypoOrHypertension,
        renalDisorder: updateData.renalDisorder ?? anamnesis.renalDisorder,
        varicoseVeinsOrLesions: updateData.varicoseVeinsOrLesions ?? anamnesis.varicoseVeinsOrLesions,
        pregnant: updateData.pregnant ?? anamnesis.pregnant,
        gestationalWeeks: updateData.gestationalWeeks ?? anamnesis.gestationalWeeks,
        underMedicalTreatment: updateData.underMedicalTreatment ?? anamnesis.underMedicalTreatment,
        medicalTreatmentDetails: updateData.medicalTreatmentDetails ?? anamnesis.medicalTreatmentDetails,
        usesMedication: updateData.usesMedication ?? anamnesis.usesMedication,
        medicationDetails: updateData.medicationDetails ?? anamnesis.medicationDetails,
        allergy: updateData.allergy ?? anamnesis.allergy,
        allergyDetails: updateData.allergyDetails ?? anamnesis.allergyDetails,
        lactoseIntolerance: updateData.lactoseIntolerance ?? anamnesis.lactoseIntolerance,
        diabetes: updateData.diabetes !== undefined ? updateData.diabetes : anamnesis.diabetes,
        roacutan: updateData.roacutan ?? anamnesis.roacutan,
        recentSurgery: updateData.recentSurgery ?? anamnesis.recentSurgery,
        recentSurgeryDetails: updateData.recentSurgeryDetails ?? anamnesis.recentSurgeryDetails,
        tumorOrPrecancerousLesion: updateData.tumorOrPrecancerousLesion ?? anamnesis.tumorOrPrecancerousLesion,
        tumorOrLesionDetails: updateData.tumorOrLesionDetails ?? anamnesis.tumorOrLesionDetails,
        skinProblems: updateData.skinProblems ?? anamnesis.skinProblems,
        skinProblemsDetails: updateData.skinProblemsDetails ?? anamnesis.skinProblemsDetails,
        orthopedicProblems: updateData.orthopedicProblems ?? anamnesis.orthopedicProblems,
        orthopedicProblemsDetails: updateData.orthopedicProblemsDetails ?? anamnesis.orthopedicProblemsDetails,
        hasBodyOrFacialProsthesis: updateData.hasBodyOrFacialProsthesis ?? anamnesis.hasBodyOrFacialProsthesis,
        prosthesisDetails: updateData.prosthesisDetails ?? anamnesis.prosthesisDetails,
        usingAcids: updateData.usingAcids ?? anamnesis.usingAcids,
        acidsDetails: updateData.acidsDetails ?? anamnesis.acidsDetails,
        otherRelevantIssues: updateData.otherRelevantIssues ?? anamnesis.otherRelevantIssues,
        bloodPressure: updateData.bloodPressure ?? anamnesis.bloodPressure,
        height: updateData.height ?? anamnesis.height,
        initialWeight: updateData.initialWeight ?? anamnesis.initialWeight,
        finalWeight: updateData.finalWeight ?? anamnesis.finalWeight,
        createdAt: anamnesis.createdAt,
        updatedAt: new Date(),
      },
      anamnesis.id,
    );

    await this.anamnesisRepository.save(updatedAnamnesis);

    return makeRight({ anamnesis: updatedAnamnesis });
  }
}
