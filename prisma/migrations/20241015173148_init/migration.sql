/*
  Warnings:

  - Added the required column `typeOfUser` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('DONOR', 'VOLUNTEER', 'NEEDY');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "donatedAmount" DOUBLE PRECISION,
ADD COLUMN     "donatedFood" INTEGER,
ADD COLUMN     "eventsParticipated" INTEGER,
ADD COLUMN     "howManyDilsDone" INTEGER,
ADD COLUMN     "typeOfUser" "UserType" NOT NULL;
