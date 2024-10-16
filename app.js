const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

//router imports
const DonationRouter = require("./router/DonationRouter");
const AuthenticationRouter = require("./router/AuthenticationRouter");

//port
const PORT = process.env.PORT || 3000;

//create the app
const app = express();
app.use(cookieParser());

//middlewares
app.use(express.json())

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());



//router
app.use("/auth",AuthenticationRouter);
app.use(DonationRouter);





app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
