/*
  Warnings:

  - The values [UNDER_6_MONTHS,SIX_TO_TWELVE,ONE_TO_THREE,FOUR_TO_SIX,SEVEN_TO_TWELVE] on the enum `AgeGroup` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `latitude` to the `FoodDonate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `FoodDonate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AgeGroup_new" AS ENUM ('UNDER_SIX_MONTHS', 'SIX_TO_TWELVE_MONTHS', 'ONE_TO_THREE_YEARS', 'FOUR_TO_SIX_YEARS', 'SEVEN_TO_TWELVE_YEARS', 'THIRTEEN_PLUS');
ALTER TABLE "FoodItem" ALTER COLUMN "ageGroup" TYPE "AgeGroup_new" USING ("ageGroup"::text::"AgeGroup_new");
ALTER TYPE "AgeGroup" RENAME TO "AgeGroup_old";
ALTER TYPE "AgeGroup_new" RENAME TO "AgeGroup";
DROP TYPE "AgeGroup_old";
COMMIT;

-- AlterTable
ALTER TABLE "FoodDonate" ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "pickup" SET DATA TYPE TEXT;
