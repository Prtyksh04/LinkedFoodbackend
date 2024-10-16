// In your routes file (e.g., routes.js or app.js)
const express = require("express");
const router = express.Router();
const DonateController = require("../controller/Donation");
// Other routes...
router.post("/donatemoney", DonateController.donateMoney);    //done 
router.post('/donatefood',DonateController.createFoodDonation);   //done
router.get("/getfoodDonation" , DonateController.getFoodDonation);  //done
router.post('/foodRequest',DonateController.foodRequest);      //done
// router.patch("/foodRequestUpdate/:requestId",DonateController.FoodRequestUpdate);
router.get('/getDonorRequest',DonateController.getDonorRequest);     //done
router.put('/acceptFoodRequest/:requestId',DonateController.acceptFoodRequest)      //done
router.put("/rejectFoodRequest/:requestId",DonateController.rejectFoodRequest);     //done
router.put("/completeFoodRequest/:requestId" ,DonateController.completeFoodRequest);
router.get('/getFoodRequestForVolunteer',DonateController.getFoodRequestsForVolunteer);  //done
router.put('/volunteerTakesFoodRequest/:requestId',DonateController.volunteerTakesFoodRequest);   //done
router.get("/getDelivery",DonateController.getDeliveriesOnTheWay);   //done



module.exports = router;
