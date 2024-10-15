const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const donateMoney = async (req, res) => {
    const { userEmail, name, donationAmount } = req.body;

    try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { userEmail },
        });

        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Calculate new total donation amount
        const totalDonation = existingUser.donatedAmount ? existingUser.donatedAmount + donationAmount : donationAmount;

        // Update user's donated amount
        const updatedUser = await prisma.user.update({
            where: { userEmail },
            data: { donatedAmount: totalDonation },
        });

        // Respond with updated donation info
        return res.status(200).json({
            message: "Donation successful",
            totalDonated: updatedUser.donatedAmount,
        });
    } catch (error) {
        console.error("Error processing donation:", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};


const createFoodDonation = async (req, res) => {
    const { organizationName, pickup, longitude, latitude, foodItems } = req.body;

    try {
      // Create food donation with associated food items
      const foodDonation = await prisma.foodDonate.create({
        data: {
          organizationName,
          pickup,
          longitude,
          latitude,
          foodItems: {
            create: foodItems.map(item => ({
              itemName: item.itemName,
              quantityKg: item.quantityKg,
              expiryDate: new Date(item.expiryDate), // Ensure this is a Date object
              ageGroup: item.ageGroup, // Assuming ageGroup is passed as a string matching the enum
            })),
          },
        },
      });
  
      res.status(201).json({
        message: 'Food donation created successfully',
        foodDonation,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while creating the food donation.' });
    }
};





module.exports = {
    donateMoney,
    createFoodDonation
};