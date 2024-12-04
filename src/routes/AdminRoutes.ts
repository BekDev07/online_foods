import express, { Request, Response, NextFunction } from "express";
import { CreateVendor, GetTransactions, GetVendorByID, GetVendors } from "../controllers";

const router = express.Router();

router.post("/vendor", CreateVendor);
router.get("/vendors", GetVendors);
router.get("/vendors/:id", GetVendorByID);

router.get("/transactions", GetTransactions);
router.get("/transaction/:id", GetTransactions);

export { router as AdminRoutes };
