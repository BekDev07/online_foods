import express, { Request, Response, NextFunction } from "express";
import {
  AddFood,
  AddOffer,
  EditOffer,
  GetCurrentOrders,
  GetFoods,
  GetOffers,
  GetOrderDetails,
  GetVendorProfile,
  ProcessOrder,
  UpdateProfile,
  UpdateVendorCoverImage,
  UpdateVendorService,
  VendorLogin,
} from "../controllers";
import { Authenticate } from "../middlewares";
import multer from "multer";
import path from "path";

const router = express.Router();

const imageStorage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    const dir = path.join(__dirname, "../images");
    console.log("Saving file to directory:", dir); // Debug
    cb(null, dir);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const uniqueName =
      new Date().toISOString().replace(/:/g, "-") + "_" + file.originalname;
    console.log("Generated file name:", uniqueName); // Debug
    cb(null, uniqueName);
  },
});


const images = multer({ storage: imageStorage }).array("images", 10);

router.post("/login", VendorLogin);

router.use(Authenticate);
router.get("/profile", GetVendorProfile);
router.patch("/coverImage", images, UpdateVendorCoverImage);
router.patch("/profile", UpdateProfile);
router.patch("/service", UpdateVendorService);

router.post("/food", images, AddFood);
router.get("/foods", GetFoods);

// Orders
router.get('/orders', GetCurrentOrders);
router.put('/order/:id/process', ProcessOrder);
router.get('/order/:id', GetOrderDetails)

// Offers
router.get("/offers", GetOffers)
router.post("/offer", AddOffer)
router.put("/offer/:id", EditOffer)

export { router as VendorRoutes };
