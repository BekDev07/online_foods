import { Request, Response, NextFunction } from "express";
import { FindVendor } from "./AdminController";
import { EditVendorInputs, VendorLoginInput } from "../dto";
import {
  GenerateSignature,
  ValidatePassword,
  ValidateSignature,
} from "../utility";
import { Vendor } from "../models";
import { CreateFoodInputs } from "../dto/Food.dto";
import { Food } from "../models/Food";
import { Multer } from "multer";
import { Order } from "../models/Order";

export const VendorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <VendorLoginInput>req.body;

  const existingUser = await FindVendor("", email);

  if (existingUser !== null) {
    const validation = await ValidatePassword(
      password,
      existingUser.password,
      existingUser.salt
    );
    if (validation) {
      const signature = GenerateSignature({
        _id: existingUser._id as string,
        email: existingUser.email,
        name: existingUser.name,
        foodType: existingUser.foodType,
      });
      res.json(signature);
      return;
    } else {
      res.status(400).json({ message: "Username or password is not valid!" });
      return;
    }
  }

  res.json({ message: "Login credential is not valid" });
  return;
};

export const GetVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const existingVendor = await FindVendor(user._id);
    res.status(200).json(existingVendor);
    return;
  }

  // ValidateSignature(req);
  res.status(401).json({ message: "Vendor not Found" });
};

export const UpdateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  const { name, address, foodTypes, phone } = <EditVendorInputs>req.body;

  if (user) {
    const existingVendor = await FindVendor(user._id);
    if (existingVendor) {
      existingVendor.name = name;
      existingVendor.address = address;
      existingVendor.foodType = foodTypes;
      existingVendor.phone = phone;
      const savedResult = await existingVendor.save();
      res.json(savedResult);
      return;
    }
    res.status(200).json(existingVendor);
    return;
  }

  res.status(401).json({ message: "Vendor not Found" });
};

export const UpdateProfileService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const existingVendor = await FindVendor(user._id);
    if (existingVendor) {
      existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
      const savedResult = await existingVendor.save();
      res.json(savedResult);
      return;
    }
    res.status(200).json(existingVendor);
    return;
  }

  res.status(401).json({ message: "Vendor not Found" });
};

export const UpdateVendorCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {
    const user = req.user;
    if (user) {

      const vendor = await FindVendor(user._id);

      if (vendor) {
        const files = req.files as [Express.Multer.File];
        console.log(files);

        const images = files.map(
          (file: Express.Multer.File) => file.originalname
        );
        console.log(images);

        vendor.coverImages.push(...images);
        const result = await vendor.save();
        res.json(result);
        return;
      }
    }

    res.json({ message: "Vendor not Found" });
  } catch (error) {
    console.error("bizning xato: ", error);
  }

  res.status(401).json({ message: "Vendor not Found" });
};
export const AddFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (user) {
      const { name, description, category, foodType, readyTime, price } = <CreateFoodInputs>req.body;

      const vendor = await FindVendor(user._id);

      if (vendor) {
        const files = req.files as [Express.Multer.File];
        const images = files.map(
          (file: Express.Multer.File) => file.originalname
        );
        const createdFood = await Food.create({
          vendorId: vendor._id,
          name: name,
          description,
          category: category,
          foodType,
          images: images,
          readyTime,
          price,
          rating: 0,
        });
        vendor.foods.push(createdFood);
        const result = await vendor.save();
        res.json(result);
        return;
      }
    }

    res.json({ message: "Vendor not Found" });
  } catch (error) {
    console.error(error);
  }
};

export const GetFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const foods = await Food.find({ vendorId: user._id });
    if (foods) {
      res.json(foods);
      return;
    }
  }

  res.json({ message: "Food information not found" });
};

export const GetCurrentOrders = async (req: Request, res: Response, next: NextFunction) => {

  const user = req.user;

  if (user) {

    const orders = await Order.find({ vendorId: user._id }).populate('items.food');

    if (orders != null) {
      res.status(200).json(orders);
      return
    }
  }

  res.json({ message: 'Orders Not found' });
  return
}

export const GetOrderDetails = async (req: Request, res: Response, next: NextFunction) => {

  const orderId = req.params.id;

  if (orderId) {

    const order = await Order.findById(orderId).populate('items.food');

    if (order != null) {
      res.status(200).json(order);
      return
    }
  }

  res.json({ message: 'Order Not found' });
  return
}

export const ProcessOrder = async (req: Request, res: Response, next: NextFunction) => {

  const orderId = req.params.id;

  const { status, remarks, time } = req.body;


  if (orderId) {

    const order = await Order.findById(orderId).populate('food');

    order.orderStatus = status;
    order.remarks = remarks;
    if (time) {
      order.readyTime = time;
    }

    const orderResult = await order.save();

    if (orderResult != null) {
      res.status(200).json(orderResult);
      return
    }
  }

  res.json({ message: 'Unable to process order' });
  return
}
