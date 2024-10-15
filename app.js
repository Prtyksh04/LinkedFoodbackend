const express = require("express");
const bodyParser = require("body-parser");


const app = express();
app.use(express.json())
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());


const DonationRouter = require("./router/DonationRouter");
const AuthenticationRouter = require("./router/AuthenticationRouter");



app.use("/auth",AuthenticationRouter);
app.use(DonationRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
