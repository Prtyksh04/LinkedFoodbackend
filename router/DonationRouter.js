// In your routes file (e.g., routes.js or app.js)
const express = require("express");
const router = express.Router();
const DonateController = require("../controller/Donation");
// Other routes...
router.post("/donatemoney", DonateController.donateMoney);
router.post('/donatefood',DonateController.createFoodDonation);

module.exports = router;
