/*
  Warnings:

  - Added the required column `ageGroup` to the `FoodItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AgeGroup" AS ENUM ('UNDER_6_MONTHS', 'SIX_TO_TWELVE', 'ONE_TO_THREE', 'FOUR_TO_SIX', 'SEVEN_TO_TWELVE', 'THIRTEEN_PLUS');

-- AlterTable
ALTER TABLE "FoodItem" ADD COLUMN     "ageGroup" "AgeGroup" NOT NULL;
