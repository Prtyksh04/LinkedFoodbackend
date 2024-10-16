const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

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
    const { organizationName, pickup, location, foodItems } = req.body;

    // Access the token from the cookies
    const token = req.cookies['auth-token']; // Assuming 'auth-token' is the cookie name

    if (!token) {
        console.log('Token not found');
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        // Create food donation with associated food items and link to the donor
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        const userEmail = decodedToken.userEmail;
        console.log("userId", userId);
        console.log("long : ", location.longitude)
        console.log("latitude", location.latitude);
        const foodDonation = await prisma.foodDonate.create({
            data: {
                organizationName,
                pickup,
                longitude: location.longitude,
                latitude: location.latitude,
                donor: {
                    connect: { id: userId },
                },
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



const getFoodDonation = async (req, res) => {
    const foodDonations = await prisma.foodDonate.findMany({
        include: {
            foodItems: true,
        },
    });
    res.json(foodDonations);
}

const foodRequest = async (req, res) => {
    const { foodDonateId } = req.body;
    const token = req.cookies['auth-token'];
    console.log("Token : ", token);

    if (!token) {
        console.log('Token not found');
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        const foodRequest = await prisma.foodRequest.create({
            data: {
                foodDonateId,
                needyUserId: userId,
                status: 'PENDING',
            },
        });
        console.log("Foodrequest", foodRequest);
        res.status(201).json(foodRequest);
    } catch (error) {
        console.error("Error creating food request:", error);
        res.status(500).json({ message: 'An error occurred while creating the food request.' });
    }
}

const getDonorRequest = async (req, res) => {
    const token = req.cookies['auth-token'];
    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJFbWFpbCI6InRlc3R1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNzI5MDQ5MzQ2LCJleHAiOjE3MjkwNTI5NDZ9.1bPAuzfWmm3goST2FViriI97-Ef9-ARrCmyyfbIjbAg"

    if (!token) {
        console.log('Token not found');
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        // Verify and decode the JWT token to get the userId (donorId)
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        // Fetch food donation requests related to this donor
        const foodRequests = await prisma.foodRequest.findMany({
            where: {
                foodDonate: {
                    userId: userId, // Ensure the logged-in user is the donor
                },
            },
            include: {
                foodDonate: {
                    include: {
                        foodItems: true, // Include details of the donated food items
                    },
                },
                needyUser: true, // Include details about the needy user requesting food
                volunteer: true, // Include details about the volunteer (if assigned)
            },
        });

        // Return the food requests associated with this donor
        res.status(200).json(foodRequests);
    } catch (error) {
        console.error("Error getting food requests:", error);
        res.status(500).json({ message: 'An error occurred while getting the food requests.' });
    }
};


const acceptFoodRequest = async (req, res) => {
    const { requestId } = req.params;
    console.log("requestId", requestId);
    const token = req.cookies['auth-token']; // Assuming 'auth-token' is the cookie name

    if (!token) {
        console.log('Token not found');
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;


        const updatedRequest = await prisma.foodRequest.update({
            where: {
                id: Number(requestId),
            },
            data: {
                status: 'ACCEPTED',
            },
        });
        res.status(200).json(updatedRequest);
    } catch (error) {
        console.error("Error accepting food request:", error);
        res.status(500).json({ message: 'An error occurred while accepting the food request.' });
    }
}


// Endpoint for the donor to reject a food request
const rejectFoodRequest = async (req, res) => {
    const { requestId } = req.params;
    console.log("requestId: " , requestId);
    try {
        const updatedRequest = await prisma.foodRequest.delete({
            where: {
                id: Number(requestId),
            },
        });
        res.status(200).json(updatedRequest);
    } catch (error) {
        console.error("Error rejecting food request:", error);
        res.status(500).json({ message: 'An error occurred while rejecting the food request.' });
    }
}

// Endpoint for volunteers to get accepted food requests
const getFoodRequestsForVolunteer = async (req, res) => {

    try {
        const foodRequests = await prisma.foodRequest.findMany({
            where: {
                status: 'ACCEPTED', // Only fetch accepted requests
            },
            include: {
                foodDonate: true,
            },
        });
        res.status(200).json(foodRequests);
    } catch (error) {
        console.error("Error fetching food requests for volunteers:", error);
        res.status(500).json({ message: 'An error occurred while fetching food requests.' });
    }
}

const volunteerTakesFoodRequest = async (req, res) => {
    const { requestId } = req.params; 

    const token = req.cookies['auth-token']; // Assuming 'auth-token' is the cookie name

    if (!token) {
        console.log('Token not found');
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        // Find the food request and ensure it's currently accepted

         // Verify and decode the JWT token to get the userId (donorId)
         const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
         const userId = decodedToken.userId;
         const volunteerId = userId;

         console.log("userId : " , userId);

        const foodRequest = await prisma.foodRequest.findUnique({
            where: { id: Number(requestId) },
        });

        if (!foodRequest) {
            return res.status(404).json({ message: 'Food request not found' });
        }

        if (foodRequest.status !== 'ACCEPTED') {
            return res.status(400).json({ message: 'Food request is not available for volunteers' });
        }

        // Update the food request status to 'IN_PROGRESS' and assign the volunteer
        const updatedRequest = await prisma.foodRequest.update({
            where: { id: Number(requestId) },
            data: {
                status: 'PENDING',
                volunteerId: Number(volunteerId), // assuming you have volunteerId in the foodRequest model
            },
        });

        res.status(200).json({
            message: 'Food request successfully taken by volunteer',
            updatedRequest,
        });
    } catch (error) {
        console.error('Error updating food request:', error);
        res.status(500).json({ message: 'An error occurred while taking the food request' });
    }
};

// 

// Endpoint for the volunteer to complete the food request
const completeFoodRequest = async (req, res) => {
    const { requestId } = req.params;
    console.log('requestId: ' , requestId) ;
    const token = req.cookies['auth-token']; // Assuming 'auth-token' is the cookie name

    if (!token) {
        console.log('Token not found');
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        const volunteerId = userId;
        // Find the food request and ensure it's currently in progress
        const foodRequest = await prisma.foodRequest.delete({
            where: { id: Number(requestId) },
        });

       
        res.status(200).json({
            message: 'Food request completed successfully',
        });
    } catch (error) {
        console.error('Error completing food request:', error);
        res.status(500).json({ message: 'An error occurred while completing the food request' });
    }
};

const getDeliveriesOnTheWay = async (req, res) => {
    console.log("getDeliveriesOnTheWay");
    try {
      const pendingDeliveries = await prisma.foodRequest.findMany({
        where: {
          status: "PENDING",
        },
      });
  
      console.log("pendingRequest",pendingDeliveries);
      
      res.status(200).json(pendingDeliveries);
    } catch (error) {
      console.error("Error fetching pending deliveries:", error);
      res.status(500).json({ error: "Failed to fetch pending deliveries" });
    }
  };








module.exports = {
    donateMoney,
    createFoodDonation,
    getFoodDonation,
    foodRequest,   //post
    // FoodRequestUpdate,
    acceptFoodRequest,   //put
    rejectFoodRequest,   //put
    getFoodRequestsForVolunteer,
    getDeliveriesOnTheWay,
    completeFoodRequest,
    volunteerTakesFoodRequest,
    getDonorRequest
};