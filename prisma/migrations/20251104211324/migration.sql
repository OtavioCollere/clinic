/*
  Warnings:

  - Made the column `address` on table `Client` required. This step will fail if there are existing NULL values in that column.
  - Made the column `profession` on table `Client` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "profession" SET NOT NULL;
