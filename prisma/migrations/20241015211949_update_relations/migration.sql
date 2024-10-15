-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('DONOR', 'VOLUNTEER', 'NEEDY');

-- CreateEnum
CREATE TYPE "AgeGroup" AS ENUM ('UNDER_SIX_MONTHS', 'SIX_TO_TWELVE_MONTHS', 'ONE_TO_THREE_YEARS', 'FOUR_TO_SIX_YEARS', 'SEVEN_TO_TWELVE_YEARS', 'THIRTEEN_PLUS');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "userEmail" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "typeOfUser" "UserType" NOT NULL,
    "howManyDilsDone" INTEGER,
    "eventsParticipated" INTEGER,
    "donatedFood" INTEGER,
    "donatedAmount" DOUBLE PRECISION,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodDonate" (
    "id" SERIAL NOT NULL,
    "organizationName" TEXT NOT NULL,
    "pickup" BOOLEAN NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "FoodDonate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodItem" (
    "id" SERIAL NOT NULL,
    "itemName" TEXT NOT NULL,
    "quantityKg" DOUBLE PRECISION NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "ageGroup" "AgeGroup" NOT NULL,
    "foodDonateId" INTEGER NOT NULL,

    CONSTRAINT "FoodItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodRequest" (
    "id" SERIAL NOT NULL,
    "foodDonateId" INTEGER NOT NULL,
    "needyUserId" INTEGER NOT NULL,
    "volunteerId" INTEGER,
    "status" "RequestStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FoodRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userEmail_key" ON "User"("userEmail");

-- AddForeignKey
ALTER TABLE "FoodDonate" ADD CONSTRAINT "FoodDonate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodItem" ADD CONSTRAINT "FoodItem_foodDonateId_fkey" FOREIGN KEY ("foodDonateId") REFERENCES "FoodDonate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodRequest" ADD CONSTRAINT "FoodRequest_foodDonateId_fkey" FOREIGN KEY ("foodDonateId") REFERENCES "FoodDonate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodRequest" ADD CONSTRAINT "FoodRequest_needyUserId_fkey" FOREIGN KEY ("needyUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodRequest" ADD CONSTRAINT "FoodRequest_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
