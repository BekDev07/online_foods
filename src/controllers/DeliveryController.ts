import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import express, { Request, Response, NextFunction } from 'express';
import {
  CartItem,
  CreateCustomerInput,
  CreateDeliveryUserInput,
  EditCustomerProfileInput,
  OrderInputs,
  UserLoginInput
} from '../dto';
import { Customer, DeliveryUser, Food, Vendor } from '../models';
import { Offer } from '../models/Offer';
import { Order } from '../models/Order';
import { Transaction } from '../models/Transaction';
import { GenerateOtp, GeneratePassword, GenerateSalt, GenerateSignature, onRequestOTP, ValidatePassword } from '../utility';

export const DeliverySignUp = async (req: Request, res: Response, next: NextFunction) => {

  const deliveryUserInputs = plainToClass(CreateDeliveryUserInput, req.body);

  const validationError = await validate(deliveryUserInputs, { validationError: { target: true } })

  if (validationError.length > 0) {
    res.status(400).json(validationError);
    return
  }

  const { email, phone, password, address, firstName, lastName, pincode } = deliveryUserInputs;

  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);

  const existingDeliveryUser = await DeliveryUser.findOne({ email: email });

  if (existingDeliveryUser !== null) {
    res.status(400).json({ message: 'A Delivery User exist with the provided email ID!' });
    return
  }

  const result = await DeliveryUser.create({
    email: email,
    password: userPassword,
    salt: salt,
    phone: phone,
    firstName: firstName,
    lastName: lastName,
    address: address,
    pincode: pincode,
    verified: false,
    lat: 0,
    lng: 0,

  })

  if (result) {

    //Generate the Signature
    const signature = GenerateSignature({
      _id: result._id as string,
      email: result.email,
      verified: result.verified
    })
    // Send the result
    res.status(201).json({ signature, verified: result.verified, email: result.email })
    return

  }

  res.status(400).json({ msg: 'Error while creating Delivery user' });
  return


}

export const DeliveryLogin = async (req: Request, res: Response, next: NextFunction) => {


  const loginInputs = plainToClass(UserLoginInput, req.body);

  const validationError = await validate(loginInputs, { validationError: { target: true } })

  if (validationError.length > 0) {
    res.status(400).json(validationError);
    return
  }

  const { email, password } = loginInputs;

  const deliveryUser = await DeliveryUser.findOne({ email: email });
  if (deliveryUser) {
    const validation = await ValidatePassword(password, deliveryUser.password, deliveryUser.salt);

    if (validation) {

      const signature = GenerateSignature({
        _id: deliveryUser._id as string,
        email: deliveryUser.email,
        verified: deliveryUser.verified
      })

      res.status(200).json({

        signature,
        email: deliveryUser.email,
        verified: deliveryUser.verified
      })
      return
    }
  }

  res.json({ msg: 'Error Login' });
  return

}

export const GetDeliveryProfile = async (req: Request, res: Response, next: NextFunction) => {

  const deliveryUser = req.user;

  if (deliveryUser) {

    const profile = await DeliveryUser.findById(deliveryUser._id);

    if (profile) {

      res.status(201).json(profile);
      return
    }

  }
  res.status(400).json({ msg: 'Error while Fetching Profile' });
  return

}

export const EditDeliveryProfile = async (req: Request, res: Response, next: NextFunction) => {


  const deliveryUser = req.user;

  const profileInputs = plainToClass(EditCustomerProfileInput, req.body);

  const profileErrors = await validate(profileInputs, { validationError: { target: true } })

  if (profileErrors.length > 0) {
    res.status(400).json(profileErrors);
    return
  }

  const { firstName, lastName, address } = profileInputs;

  if (deliveryUser) {

    const profile = await DeliveryUser.findById(deliveryUser._id);

    if (profile) {
      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.address = address;
      const result = await profile.save()

      res.status(201).json(result);
      return
    }

  }
  res.status(400).json({ msg: 'Error while Updating Profile' });
  return

}

/* ------------------- Delivery Notification --------------------- */

export const UpdateDeliveryUserStatus = async (req: Request, res: Response, next: NextFunction) => {

  const deliveryUser = req.user;

  if (deliveryUser) {

    const { lat, lng } = req.body;

    const profile = await DeliveryUser.findById(deliveryUser._id);

    if (profile) {

      if (lat && lng) {
        profile.lat = lat;
        profile.lng = lng;
      }

      profile.isAvailable = !profile.isAvailable;

      const result = await profile.save();

      res.status(201).json(result);
      return
    }

  }
  res.status(400).json({ msg: 'Error while Updating Profile' });
  return

}