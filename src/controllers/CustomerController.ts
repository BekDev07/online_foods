import { plainToClass } from "class-transformer"
import { NextFunction, Request, Response } from "express"
import { CreateCustomerInput, EditCustomerProfileInput, OrderInputs, UserLoginInput } from "../dto/Customer.dto"
import { validate } from "class-validator"
import { Customer } from "../models/Customer"
import { GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } from "../utility/passwordUtility"
import { GenerateOtp, onRequestOTP } from "../utility/NotificationUtility"
import { Food } from "../models/Food"

export const CustomerSignUp = async (req: Request, res: Response, next: NextFunction) => {

  const customerInputs = plainToClass(CreateCustomerInput, req.body);

  const validationError = await validate(customerInputs, { validationError: { target: true } })

  if (validationError.length > 0) {
    res.status(400).json(validationError);
    return
  }

  const { email, phone, password } = customerInputs;

  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);

  const { otp, expiry } = GenerateOtp();

  const existingCustomer = await Customer.find({ email: email });

  if (existingCustomer.length > 0) {
    res.status(400).json({ message: 'Email already exist!' });
    return
  }

  const result = await Customer.create({
    email: email,
    password: userPassword,
    salt: salt,
    phone: phone,
    otp: otp,
    otp_expiry: expiry,
    firstName: '',
    lastName: '',
    address: '',
    verified: false,
    lat: 0,
    lng: 0,
    orders: []
  })

  if (result) {

    await onRequestOTP(otp, phone);

    const signature = GenerateSignature({
      _id: result._id as string,
      email: result.email,
      verified: result.verified
    })

    res.status(201).json({ signature, verified: result.verified, email: result.email })
    return
  }

  res.status(400).json({ msg: 'Error while creating user' });
  return
}

export const CustomerLogin = async (req: Request, res: Response, next: NextFunction) => {
  const customerInputs = plainToClass(UserLoginInput, req.body);

  const validationError = await validate(customerInputs, { validationError: { target: true } })

  if (validationError.length > 0) {
    res.status(400).json(validationError);
    return
  }

  const { email, password } = customerInputs;
  const customer = await Customer.findOne({ email: email });
  if (customer) {
    const validation = await ValidatePassword(password, customer.password, customer.salt);

    if (validation) {

      const signature = GenerateSignature({
        _id: customer._id as string,
        email: customer.email,
        verified: customer.verified
      })

      res.status(200).json({
        signature,
        email: customer.email,
        verified: customer.verified
      })
      return
    }
  }

  res.json({ msg: 'Error With Signup' });
  return
}

export const CustomerVerify = async (req: Request, res: Response, next: NextFunction) => {

  const { otp } = req.body;
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);
    if (profile) {
      if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
        profile.verified = true;

        const updatedCustomerResponse = await profile.save();

        const signature = GenerateSignature({
          _id: updatedCustomerResponse._id as string,
          email: updatedCustomerResponse.email,
          verified: updatedCustomerResponse.verified
        })

        res.status(200).json({
          signature,
          email: updatedCustomerResponse.email,
          verified: updatedCustomerResponse.verified
        })
        return;
      }
    }
  }

  res.status(400).json({ msg: 'Unable to verify Customer' });
  return;
}

export const RequestOtp = async (req: Request, res: Response, next: NextFunction) => {
  const customer = req.user;

  if (customer) {

    const profile = await Customer.findById(customer._id);

    if (profile) {
      const { otp, expiry } = GenerateOtp();
      profile.otp = otp;
      profile.otp_expiry = expiry;

      await profile.save();
      const sendCode = await onRequestOTP(otp, profile.phone);

      if (!sendCode) {
        res.status(400).json({ message: 'Failed to verify your phone number' })
        return
      }

      res.status(200).json({ message: 'OTP sent to your registered Mobile Number!' })
      return

    }
  }

  res.status(400).json({ msg: 'Error with Requesting OTP' });
  return
}

export const GetCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
  const customer = req.user;

  if (customer) {

    const profile = await Customer.findById(customer._id);

    if (profile) {

      res.status(201).json(profile);
      return
    }

  }
  res.status(400).json({ msg: 'Error while Fetching Profile' });
  return
}

export const EditCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {


  const customer = req.user;

  const customerInputs = plainToClass(EditCustomerProfileInput, req.body);

  const validationError = await validate(customerInputs, { validationError: { target: true } })

  if (validationError.length > 0) {
    res.status(400).json(validationError);
    return
  }

  const { firstName, lastName, address } = customerInputs;

  if (customer) {

    const profile = await Customer.findById(customer._id);

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





export const CreateOrder = async (req: Request, res: Response, next: NextFunction) => {
  const customer = req.user;

  // const { txnId, amount, items } = <[OrderInputs]>req.body;

  if (customer) {

    // const { status, currentTransaction } = await validateTransaction(txnId);

    // if (!status) {
    //   return res.status(404).json({ message: 'Error while Creating Order!' })
    // }

    const profile = await Customer.findById(customer._id);

    const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;

    const cart = <[OrderInputs]>req.body;

    let cartItems = Array();

    let netAmount = 0.0;

    let vendorId;

    const foods = await Food.find().where('_id').in(cart.map(item => item._id)).exec();

    foods.map(food => {
      cart.map(({ _id, unit }) => {
        if (food._id == _id) {
          vendorId = food.vendorId;
          netAmount += (food.price * unit);
          cartItems.push({ food._id, unit })
        }
      })
    })

    // if(cartItems){

    //     const currentOrder = await Order.create({
    //         orderId: orderId,
    //         vendorId: vendorId,
    //         items: cartItems,
    //         totalAmount: netAmount,
    //         paidAmount: amount,
    //         orderDate: new Date(),
    //         orderStatus: 'Waiting',
    //         remarks: '',
    //         deliveryId: '',
    //         readyTime: 45
    //     })

    //     profile.cart = [] as any;
    //     profile.orders.push(currentOrder);


    //     currentTransaction.vendorId = vendorId;
    //     currentTransaction.orderId = orderId;
    //     currentTransaction.status = 'CONFIRMED'

    //     await currentTransaction.save();

    //     await assignOrderForDelivery(currentOrder._id, vendorId);

    //     const profileResponse =  await profile.save();

    //     return res.status(200).json(profileResponse);

    // }

  }

  res.status(400).json({ msg: 'Error while Creating Order' });
  return
}

export const GetOrders = async (req: Request, res: Response, next: NextFunction) => {

}

export const GetOrderById = async (req: Request, res: Response, next: NextFunction) => {

}
