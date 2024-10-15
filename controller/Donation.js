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
    try {
        const { organizationName, foodItems, pickup } = req.body;

        // Check if the foodItems array exists and has at least one item
        if (!foodItems || foodItems.length === 0) {
            return res.status(400).json({ message: 'Food items are required' });
        }

        // Create a new food donation entry
        const foodDonation = await prisma.foodDonate.create({
            data: {
                organizationName,
                pickup,
                foodItems: {
                    create: foodItems.map(item => ({
                        itemName: item.itemName,
                        quantityKg: item.quantityKg,
                        expiryDate: new Date(item.expiryDate)
                    })),
                },
            },
            include: { foodItems: true } 
        });

        res.status(201).json({ message: 'Food donation created successfully', foodDonation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
};




module.exports = {
    donateMoney,
    createFoodDonation
};