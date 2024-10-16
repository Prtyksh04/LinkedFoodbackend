// In your routes file (e.g., routes.js or app.js)
const express = require("express");
const router = express.Router();
const DonateController = require("../controller/Donation");
// Other routes...
router.post("/donatemoney", DonateController.donateMoney);    //done 
router.post('/donatefood',DonateController.createFoodDonation);   //done
router.get("/getfoodDonation" , DonateController.getFoodDonation);  //done
router.post('/foodRequest',DonateController.foodRequest);      //done
router.get('/getfoodRequestByNeededUser/:userId',DonateController.GetFoodRequestByNeededUser);
// router.patch("/foodRequestUpdate/:requestId",DonateController.FoodRequestUpdate);
router.get('/getDonorRequest',DonateController.getDonorRequest);
router.put('/acceptFoodRequest/:requestId',DonateController.acceptFoodRequest)
router.put("/rejectFoodRequest",DonateController.rejectFoodRequest);
router.put("/completeFoodRequest/:requestId" ,DonateController.completeFoodRequest);
router.put('/getFoodRequestForVolunteer',DonateController.GetFoodRequestByNeededUser);
router.patch('/volunteerTakesFoodRequest/:requestId',DonateController.volunteerTakesFoodRequest);



module.exports = router;
