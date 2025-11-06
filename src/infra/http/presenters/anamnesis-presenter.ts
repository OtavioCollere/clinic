// src/infra/http/presenters/anamnesis-presenter.ts
import { Anamnesis } from "@/domain/enterprise/entities/anamnesis";

export class AnamnesisPresenter {
  static toHTTP(anamnesis: Anamnesis) {
    return {
      id: anamnesis.id.toString(),
      clientId: anamnesis.clientId.toString(),

      // Aesthetic history
      hadPreviousAestheticTreatment: anamnesis.hadPreviousAestheticTreatment,
      botulinumToxin: anamnesis.botulinumToxin,
      botulinumRegion: anamnesis.botulinumRegion ?? null,
      filler: anamnesis.filler,
      fillerRegion: anamnesis.fillerRegion ?? null,
      fillerProduct: anamnesis.fillerProduct ?? null,
      suspensionThreads: anamnesis.suspensionThreads,
      suspensionThreadsRegion: anamnesis.suspensionThreadsRegion ?? null,
      suspensionThreadsProduct: anamnesis.suspensionThreadsProduct ?? null,
      surgicalLift: anamnesis.surgicalLift,
      surgicalLiftRegion: anamnesis.surgicalLiftRegion ?? null,
      surgicalLiftProduct: anamnesis.surgicalLiftProduct ?? null,
      chemicalPeeling: anamnesis.chemicalPeeling,
      chemicalPeelingRegion: anamnesis.chemicalPeelingRegion ?? null,
      chemicalPeelingProduct: anamnesis.chemicalPeelingProduct ?? null,
      laser: anamnesis.laser,
      laserRegion: anamnesis.laserRegion ?? null,
      laserProduct: anamnesis.laserProduct ?? null,
      exposedToHeatOrColdWork: anamnesis.exposedToHeatOrColdWork,

      // Health
      smoker: anamnesis.smoker,
      circulatoryDisorder: anamnesis.circulatoryDisorder,
      epilepsy: anamnesis.epilepsy,
      regularMenstrualCycle: anamnesis.regularMenstrualCycle,
      regularIntestinalFunction: anamnesis.regularIntestinalFunction,
      cardiacAlterations: anamnesis.cardiacAlterations,
      hormonalDisorder: anamnesis.hormonalDisorder,
      hypoOrHypertension: anamnesis.hypoOrHypertension,
      renalDisorder: anamnesis.renalDisorder,
      varicoseVeinsOrLesions: anamnesis.varicoseVeinsOrLesions,
      pregnant: anamnesis.pregnant,
      gestationalWeeks: anamnesis.gestationalWeeks ?? null,
      underMedicalTreatment: anamnesis.underMedicalTreatment,
      medicalTreatmentDetails: anamnesis.medicalTreatmentDetails ?? null,

      // Allergies / meds / diseases
      usesMedication: anamnesis.usesMedication,
      medicationDetails: anamnesis.medicationDetails ?? null,
      allergy: anamnesis.allergy,
      allergyDetails: anamnesis.allergyDetails ?? null,
      lactoseIntolerance: anamnesis.lactoseIntolerance,
      diabetes: anamnesis.diabetes, // controlled | yes | no | null
      roacutan: anamnesis.roacutan,

      // Additional
      recentSurgery: anamnesis.recentSurgery,
      recentSurgeryDetails: anamnesis.recentSurgeryDetails ?? null,
      tumorOrPrecancerousLesion: anamnesis.tumorOrPrecancerousLesion,
      tumorOrLesionDetails: anamnesis.tumorOrLesionDetails ?? null,
      skinProblems: anamnesis.skinProblems,
      skinProblemsDetails: anamnesis.skinProblemsDetails ?? null,
      orthopedicProblems: anamnesis.orthopedicProblems,
      orthopedicProblemsDetails: anamnesis.orthopedicProblemsDetails ?? null,
      hasBodyOrFacialProsthesis: anamnesis.hasBodyOrFacialProsthesis,
      prosthesisDetails: anamnesis.prosthesisDetails ?? null,
      usingAcids: anamnesis.usingAcids,
      acidsDetails: anamnesis.acidsDetails ?? null,
      otherRelevantIssues: anamnesis.otherRelevantIssues ?? null,

      // Measurements
      bloodPressure: anamnesis.bloodPressure ?? null,
      height: anamnesis.height ?? null,
      initialWeight: anamnesis.initialWeight ?? null,
      finalWeight: anamnesis.finalWeight ?? null,

      createdAt: anamnesis.createdAt,
      updatedAt: anamnesis.updatedAt ?? null,
    };
  }
}
