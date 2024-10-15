const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const signup = async (req, res) => {
    const { userEmail, name, password, typeOfUser, howManyDilsDone = null, eventsParticipated = null, donatedFood = null, donatedAmount = null } = req.body;
    console.log("req.body : ", req.body);
    try {
        // Check if the user already exists
        const existingUser = await prisma.user.findUnique({ where: { userEmail } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await prisma.user.create({
            data: {
                userEmail,
                name,
                password: hashedPassword,
                typeOfUser,
                howManyDilsDone,
                eventsParticipated,
                donatedFood,
                donatedAmount
            },
        });

        // Generate a JWT token
        const token = jwt.sign(
            { userId: newUser.id, userEmail: newUser.userEmail, typeOfUser: newUser.typeOfUser },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            userEmail: newUser.userEmail,
            name: newUser.name,
            typeOfUser: newUser.typeOfUser,
        });
    } catch (error) {
        console.error(error); // Log the complete error
        res.status(500).json({ message: 'Something went wrong', error });
    }
};



// Login route
const login = async (req, res) => {
    const { userEmail, password } = req.body;

    try {
        // Check if the user exists
        const existingUser = await prisma.user.findUnique({ where: { userEmail } });

        if (!existingUser) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { userId: existingUser.id, userEmail: existingUser.userEmail },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            userEmail: existingUser.userEmail,
            name: existingUser.name,
            howManyDilsDone: existingUser.howManyDilsDone,
            eventsParticipated: existingUser.eventsParticipated,
            donatedFood: existingUser.donatedFood,
            donatedAmount: existingUser.donatedAmount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
};



module.exports = { login ,signup};