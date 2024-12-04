import { NextFunction, Request, Response } from "express";
import { CreateVendorInput } from "../dto";
import { Transaction, Vendor } from "../models";
import { GeneratePassword, GenerateSalt } from "../utility";

export const FindVendor = async (id: String | undefined, email?: string) => {
  if (email) {
    return await Vendor.findOne({ email: email });
  } else {
    return await Vendor.findById(id);
  }
};

export const CreateVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const {
    name,
    ownerName,
    foodType,
    address,
    email,
    password,
    phone,
    pincode,
  } = <CreateVendorInput>req.body;

  const existingVendor = await FindVendor("", email);

  if (existingVendor !== null) {
    res.json({ message: "A vendor is exist with this email ID" });
    return;
  }

  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);

  const createdVendor = await Vendor.create({
    name: name,
    address: address,
    pincode: pincode,
    foodType: foodType,
    email: email,
    password: userPassword,
    salt: salt,
    ownerName: ownerName,
    phone: phone,
    rating: 0,
    serviceAvailable: false,
    coverImages: [],
    foods: [],
  });

  res.status(201).json(createdVendor);
  return;
};

export const GetVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendors = await Vendor.find();

  if (vendors !== null) {
    res.json(vendors);
    return;
  }

  res.json({ message: "Vendors data not available" });
  return;
};

export const GetVendorByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const vendor = await FindVendor(id);

  if (!vendor) {
    res.status(404).json({ message: "Ma'lumot topilmadi!" });
    return;
  }

  res.status(200).json({ data: vendor });
};

export const GetTransactions = async (req: Request, res: Response, next: NextFunction) => {

  const transactions = await Transaction.find();

  if (transactions) {
    res.status(200).json(transactions)
    return
  }

  res.json({ "message": "Transactions data not available" })
  return

}

export const GetTransactionById = async (req: Request, res: Response, next: NextFunction) => {

  const id = req.params.id;

  const transaction = await Transaction.findById(id);

  if (transaction) {
    return res.status(200).json(transaction)
  }

  return res.json({ "message": "Transaction data not available" })

}
