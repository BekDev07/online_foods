import express from "express";
import { CreateVendor, GetDeliveryUsers, GetTransactions, GetVendorByID, GetVendors, VerifyDeliveryUser } from "../controllers";

const router = express.Router();

router.post("/vendor", CreateVendor);
router.get("/vendors", GetVendors);
router.get("/vendors/:id", GetVendorByID);

router.get("/transactions", GetTransactions);
router.get("/transaction/:id", GetTransactions);

router.put("/delivery/verify", VerifyDeliveryUser)
router.get('/delivery/users', GetDeliveryUsers);

export { router as AdminRoutes };
