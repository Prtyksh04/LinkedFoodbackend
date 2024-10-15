-- CreateTable
CREATE TABLE "FoodDonate" (
    "id" SERIAL NOT NULL,
    "organizationName" TEXT NOT NULL,
    "pickup" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FoodDonate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FoodItem" (
    "id" SERIAL NOT NULL,
    "itemName" TEXT NOT NULL,
    "quantityKg" DOUBLE PRECISION NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "foodDonateId" INTEGER NOT NULL,

    CONSTRAINT "FoodItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FoodItem" ADD CONSTRAINT "FoodItem_foodDonateId_fkey" FOREIGN KEY ("foodDonateId") REFERENCES "FoodDonate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
