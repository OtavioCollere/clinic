import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Anamnesis } from "@/domain/enterprise/entities/anamnesis";
import { Prisma, Anamnesis as PrismaAnamnesis } from "@/generated/client";

export class PrismaAnamnesisMapper {
  static toDomain(raw: PrismaAnamnesis): Anamnesis {
    return Anamnesis.create(
      {
        clientId: new UniqueEntityID(raw.clientId),

        // --- Aesthetic history ---
        hadPreviousAestheticTreatment: raw.hadPreviousAestheticTreatment,
        botulinumToxin: raw.botulinumToxin,
        botulinumRegion: raw.botulinumRegion ?? undefined,
        filler: raw.filler,
        fillerRegion: raw.fillerRegion ?? undefined,
        fillerProduct: raw.fillerProduct ?? undefined,
        suspensionThreads: raw.suspensionThreads,
        suspensionThreadsRegion: raw.suspensionThreadsRegion ?? undefined,
        suspensionThreadsProduct: raw.suspensionThreadsProduct ?? undefined,
        surgicalLift: raw.surgicalLift,
        surgicalLiftRegion: raw.surgicalLiftRegion ?? undefined,
        surgicalLiftProduct: raw.surgicalLiftProduct ?? undefined,
        chemicalPeeling: raw.chemicalPeeling,
        chemicalPeelingRegion: raw.chemicalPeelingRegion ?? undefined,
        chemicalPeelingProduct: raw.chemicalPeelingProduct ?? undefined,
        laser: raw.laser,
        laserRegion: raw.laserRegion ?? undefined,
        laserProduct: raw.laserProduct ?? undefined,
        exposedToHeatOrColdWork: raw.exposedToHeatOrColdWork,

        // --- Health conditions ---
        smoker: raw.smoker,
        circulatoryDisorder: raw.circulatoryDisorder,
        epilepsy: raw.epilepsy,
        regularMenstrualCycle: raw.regularMenstrualCycle,
        regularIntestinalFunction: raw.regularIntestinalFunction,
        cardiacAlterations: raw.cardiacAlterations,
        hormonalDisorder: raw.hormonalDisorder,
        hypoOrHypertension: raw.hypoOrHypertension,
        renalDisorder: raw.renalDisorder,
        varicoseVeinsOrLesions: raw.varicoseVeinsOrLesions,
        pregnant: raw.pregnant,
        gestationalWeeks: raw.gestationalWeeks ?? undefined,
        underMedicalTreatment: raw.underMedicalTreatment,
        medicalTreatmentDetails: raw.medicalTreatmentDetails ?? undefined,

        // --- Allergies, meds, diseases ---
        usesMedication: raw.usesMedication,
        medicationDetails: raw.medicationDetails ?? undefined,
        allergy: raw.allergy,
        allergyDetails: raw.allergyDetails ?? undefined,
        lactoseIntolerance: raw.lactoseIntolerance,
        diabetes: (raw.diabetes as "controlled" | "yes" | "no" | null) ?? null,
        roacutan: raw.roacutan,

        // --- Additional ---
        recentSurgery: raw.recentSurgery,
        recentSurgeryDetails: raw.recentSurgeryDetails ?? undefined,
        tumorOrPrecancerousLesion: raw.tumorOrPrecancerousLesion,
        tumorOrLesionDetails: raw.tumorOrLesionDetails ?? undefined,
        skinProblems: raw.skinProblems,
        skinProblemsDetails: raw.skinProblemsDetails ?? undefined,
        orthopedicProblems: raw.orthopedicProblems,
        orthopedicProblemsDetails: raw.orthopedicProblemsDetails ?? undefined,
        hasBodyOrFacialProsthesis: raw.hasBodyOrFacialProsthesis,
        prosthesisDetails: raw.prosthesisDetails ?? undefined,
        usingAcids: raw.usingAcids,
        acidsDetails: raw.acidsDetails ?? undefined,
        otherRelevantIssues: raw.otherRelevantIssues ?? undefined,

        // --- Measurements ---
        bloodPressure: raw.bloodPressure ?? undefined,
        height: raw.height ?? undefined,
        initialWeight: raw.initialWeight ?? undefined,
        finalWeight: raw.finalWeight ?? undefined,

        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(anamnesis: Anamnesis): Prisma.AnamnesisUncheckedCreateInput {
    return {
      id: anamnesis.id.toString(),
      clientId: anamnesis.clientId.toString(),

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

      usesMedication: anamnesis.usesMedication,
      medicationDetails: anamnesis.medicationDetails ?? null,
      allergy: anamnesis.allergy,
      allergyDetails: anamnesis.allergyDetails ?? null,
      lactoseIntolerance: anamnesis.lactoseIntolerance,
      diabetes: anamnesis.diabetes ?? null,
      roacutan: anamnesis.roacutan,

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

      bloodPressure: anamnesis.bloodPressure ?? null,
      height: anamnesis.height ?? null,
      initialWeight: anamnesis.initialWeight ?? null,
      finalWeight: anamnesis.finalWeight ?? null,

      createdAt: anamnesis.createdAt,
      updatedAt: anamnesis.updatedAt ?? undefined,
    };
  }
}
