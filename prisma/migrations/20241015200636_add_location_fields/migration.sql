/*
  Warnings:

  - Changed the type of `pickup` on the `FoodDonate` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "FoodDonate" DROP COLUMN "pickup",
ADD COLUMN     "pickup" BOOLEAN NOT NULL;
