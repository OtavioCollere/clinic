/*
  Warnings:

  - You are about to drop the column `userId` on the `Appointment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clientId` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_userId_fkey";

-- DropIndex
DROP INDEX "Appointment_userId_idx";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "userId",
ADD COLUMN     "clientId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Procedure" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "product" TEXT,
    "value" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Procedure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anamnesis" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "hadPreviousAestheticTreatment" BOOLEAN NOT NULL,
    "botulinumToxin" BOOLEAN NOT NULL,
    "botulinumRegion" TEXT,
    "filler" BOOLEAN NOT NULL,
    "fillerRegion" TEXT,
    "fillerProduct" TEXT,
    "suspensionThreads" BOOLEAN NOT NULL,
    "suspensionThreadsRegion" TEXT,
    "suspensionThreadsProduct" TEXT,
    "surgicalLift" BOOLEAN NOT NULL,
    "surgicalLiftRegion" TEXT,
    "surgicalLiftProduct" TEXT,
    "chemicalPeeling" BOOLEAN NOT NULL,
    "chemicalPeelingRegion" TEXT,
    "chemicalPeelingProduct" TEXT,
    "laser" BOOLEAN NOT NULL,
    "laserRegion" TEXT,
    "laserProduct" TEXT,
    "exposedToHeatOrColdWork" BOOLEAN NOT NULL,
    "smoker" BOOLEAN NOT NULL,
    "circulatoryDisorder" BOOLEAN NOT NULL,
    "epilepsy" BOOLEAN NOT NULL,
    "regularMenstrualCycle" BOOLEAN NOT NULL,
    "regularIntestinalFunction" BOOLEAN NOT NULL,
    "cardiacAlterations" BOOLEAN NOT NULL,
    "hormonalDisorder" BOOLEAN NOT NULL,
    "hypoOrHypertension" BOOLEAN NOT NULL,
    "renalDisorder" BOOLEAN NOT NULL,
    "varicoseVeinsOrLesions" BOOLEAN NOT NULL,
    "pregnant" BOOLEAN NOT NULL,
    "gestationalWeeks" INTEGER,
    "underMedicalTreatment" BOOLEAN NOT NULL,
    "medicalTreatmentDetails" TEXT,
    "usesMedication" BOOLEAN NOT NULL,
    "medicationDetails" TEXT,
    "allergy" BOOLEAN NOT NULL,
    "allergyDetails" TEXT,
    "lactoseIntolerance" BOOLEAN NOT NULL,
    "diabetes" TEXT,
    "roacutan" BOOLEAN NOT NULL,
    "recentSurgery" BOOLEAN NOT NULL,
    "recentSurgeryDetails" TEXT,
    "tumorOrPrecancerousLesion" BOOLEAN NOT NULL,
    "tumorOrLesionDetails" TEXT,
    "skinProblems" BOOLEAN NOT NULL,
    "skinProblemsDetails" TEXT,
    "orthopedicProblems" BOOLEAN NOT NULL,
    "orthopedicProblemsDetails" TEXT,
    "hasBodyOrFacialProsthesis" BOOLEAN NOT NULL,
    "prosthesisDetails" TEXT,
    "usingAcids" BOOLEAN NOT NULL,
    "acidsDetails" TEXT,
    "otherRelevantIssues" TEXT,
    "bloodPressure" TEXT,
    "height" DOUBLE PRECISION,
    "initialWeight" DOUBLE PRECISION,
    "finalWeight" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Anamnesis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Procedure_clientId_idx" ON "Procedure"("clientId");

-- CreateIndex
CREATE INDEX "Procedure_professionalId_idx" ON "Procedure"("professionalId");

-- CreateIndex
CREATE INDEX "Anamnesis_clientId_idx" ON "Anamnesis"("clientId");

-- CreateIndex
CREATE INDEX "Appointment_clientId_idx" ON "Appointment"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "Client_userId_key" ON "Client"("userId");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Procedure" ADD CONSTRAINT "Procedure_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Procedure" ADD CONSTRAINT "Procedure_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anamnesis" ADD CONSTRAINT "Anamnesis_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
