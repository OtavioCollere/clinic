/*
  Warnings:

  - You are about to drop the column `obs` on the `Client` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "obs",
ADD COLUMN     "notes" TEXT;
