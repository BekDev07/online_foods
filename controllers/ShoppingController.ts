import { Request, Response, NextFunction } from "express-serve-static-core";
import { Vendor } from "../models";

export const GetFoodAvailability = async (req: Request, res: Response, next: NextFunction) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({ pincode: pincode, serviceAvailable: true }).sort([['rating', 'descending']]).populate('foods')

  if (result.length > 0) {
    res.status(200).json(result);
    return
  }
  res.status(404).json({ msg: 'data Not found!' });
  return
}

export const GetTopRestaurants = async (req: Request, res: Response, next: NextFunction) => {
  const pincode = req.params.pincode;

  const result = await Vendor.find({ pincode: pincode, serviceAvailable: true }).sort([['rating', 'descending']]).limit(10)

  if (result.length > 0) {
    res.status(200).json(result);
    return
  }

  res.status(404).json({ msg: 'data Not found!' });
  return
}

export const GetFoodsIn30Min = async (req: Request, res: Response, next: NextFunction) => {

}
export const SearchFoods = async (req: Request, res: Response, next: NextFunction) => {

}
export const GetAvailableOffers = async (req: Request, res: Response, next: NextFunction) => {

}
export const RestaurantById = async (req: Request, res: Response, next: NextFunction) => {

}
