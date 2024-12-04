import { Request, Response, NextFunction } from "express-serve-static-core";
import { Offer, Vendor } from "../models";
import { FoodDoc } from "../models/Food";

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

  const pincode = req.params.pincode;

  const result = await Vendor.find({ pincode: pincode, serviceAvailable: true }).sort([['rating', 'descending']]).populate('foods');

  if (result.length > 0) {
    let foodResult: any = [];
    result.map(vendor => {
      const foods = vendor.foods as [FoodDoc];
      foodResult.push(...foods.filter(food => food.readyTime <= 30));
    })
    res.status(200).json(foodResult);
    return
  }

  res.status(404).json({ msg: 'data Not found!' });
  return
}

export const SearchFoods = async (req: Request, res: Response, next: NextFunction) => {

  const pincode = req.params.pincode;
  const result = await Vendor.find({ pincode: pincode, serviceAvailable: true })
    .populate('foods');

  if (result.length > 0) {
    let foodResult: any = [];
    result.map(item => foodResult.push(...item.foods));
    res.status(200).json(foodResult);
    return
  }
  res.status(404).json({ msg: 'data Not found!' });
  return
}

export const RestaurantById = async (req: Request, res: Response, next: NextFunction) => {

  const id = req.params.id;

  const result = await Vendor.findById(id).populate('foods')

  if (result) {
    res.status(200).json(result);
    return
  }

  res.status(404).json({ msg: 'data Not found!' });
  return
}

export const GetAvailableOffers = async (req: Request, res: Response, next: NextFunction) => {
  const pincode = req.params.pincode;
  const offers = await Offer.find({ pincode, isActive: true })

  if (offers) {
    res.status(200).json(offers)
    return;
  }
  res.status(400).json({ message: "Offers Not Found" })
}
