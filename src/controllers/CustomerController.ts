import { plainToClass } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import {
  CreateCustomerInput,
  EditCustomerProfileInput,
  OrderInputs,
  UserLoginInput,
} from "../dto/Customer.dto";
import { validate } from "class-validator";
import { Customer } from "../models/Customer";
import {
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} from "../utility/passwordUtility";
import { GenerateOtp, onRequestOTP } from "../utility/NotificationUtility";
import { Food } from "../models/Food";
import { Order } from "../models/Order";

export const CustomerSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customerInputs = plainToClass(CreateCustomerInput, req.body);

  const validationError = await validate(customerInputs, {
    validationError: { target: true },
  });

  if (validationError.length > 0) {
    res.status(400).json(validationError);
    return;
  }

  const { email, phone, password } = customerInputs;

  const salt = await GenerateSalt();
  const userPassword = await GeneratePassword(password, salt);

  const { otp, expiry } = GenerateOtp();

  const existingCustomer = await Customer.find({ email: email });

  if (existingCustomer.length > 0) {
    res.status(400).json({ message: "Email already exist!" });
    return;
  }

  const result = await Customer.create({
    email: email,
    password: userPassword,
    salt: salt,
    phone: phone,
    otp: otp,
    otp_expiry: expiry,
    firstName: "",
    lastName: "",
    address: "",
    verified: false,
    lat: 0,
    lng: 0,
    orders: [],
  });

  if (result) {
    await onRequestOTP(otp, phone);

    const signature = GenerateSignature({
      _id: result._id as string,
      email: result.email,
      verified: result.verified,
    });

    res
      .status(201)
      .json({ signature, verified: result.verified, email: result.email });
    return;
  }

  res.status(400).json({ msg: "Error while creating user" });
  return;
};

export const CustomerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customerInputs = plainToClass(UserLoginInput, req.body);

  const validationError = await validate(customerInputs, {
    validationError: { target: true },
  });

  if (validationError.length > 0) {
    res.status(400).json(validationError);
    return;
  }

  const { email, password } = customerInputs;
  const customer = await Customer.findOne({ email: email });
  if (customer) {
    const validation = await ValidatePassword(
      password,
      customer.password,
      customer.salt
    );

    if (validation) {
      const signature = GenerateSignature({
        _id: customer._id as string,
        email: customer.email,
        verified: customer.verified,
      });

      res.status(200).json({
        signature,
        email: customer.email,
        verified: customer.verified,
      });
      return;
    }
  }

  res.json({ msg: "Error With Signup" });
  return;
};

export const CustomerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
          verified: updatedCustomerResponse.verified,
        });

        res.status(200).json({
          signature,
          email: updatedCustomerResponse.email,
          verified: updatedCustomerResponse.verified,
        });
        return;
      }
    }
  }

  res.status(400).json({ msg: "Unable to verify Customer" });
  return;
};

export const RequestOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
        res.status(400).json({ message: "Failed to verify your phone number" });
        return;
      }

      res
        .status(200)
        .json({ message: "OTP sent to your registered Mobile Number!" });
      return;
    }
  }

  res.status(400).json({ msg: "Error with Requesting OTP" });
  return;
};

export const GetCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      res.status(201).json(profile);
      return;
    }
  }
  res.status(400).json({ msg: "Error while Fetching Profile" });
  return;
};

export const EditCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  const customerInputs = plainToClass(EditCustomerProfileInput, req.body);

  const validationError = await validate(customerInputs, {
    validationError: { target: true },
  });

  if (validationError.length > 0) {
    res.status(400).json(validationError);
    return;
  }

  const { firstName, lastName, address } = customerInputs;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      profile.firstName = firstName;
      profile.lastName = lastName;
      profile.address = address;
      const result = await profile.save();

      res.status(201).json(result);
      return;
    }
  }
  res.status(400).json({ msg: "Error while Updating Profile" });
  return;
};


/* ------------------- Cart Section --------------------- */
export const AddToCart = async (req: Request, res: Response, next: NextFunction) => {

  const customer = req.user;

  if (customer) {

    const profile = await Customer.findById(customer._id);
    let cartItems = Array();

    const { _id, unit } = <OrderInputs>req.body;

    const food = await Food.findById(_id);

    if (food) {

      if (profile != null) {
        cartItems = profile.cart;

        if (cartItems.length > 0) {
          // check and update
          let existFoodItems = cartItems.filter((item) => item.food._id.toString() === _id);
          if (existFoodItems.length > 0) {

            const index = cartItems.indexOf(existFoodItems[0]);

            if (unit > 0) {
              cartItems[index] = { food, unit };
            } else {
              cartItems.splice(index, 1);
            }

          } else {
            cartItems.push({ food, unit })
          }

        } else {
          // add new Item
          cartItems.push({ food, unit });
        }

        if (cartItems) {
          profile.cart = cartItems as any;
          const cartResult = await profile.save();
          res.status(200).json(cartResult.cart);
          return
        }

      }
    }

  }

  res.status(404).json({ msg: 'Unable to add to cart!' });
  return
}

export const GetCart = async (req: Request, res: Response, next: NextFunction) => {


  const customer = req.user;

  if (customer) {
    const profile = await Customer.findById(customer._id);

    if (profile) {
      res.status(200).json(profile.cart);
      return
    }

  }

  res.status(400).json({ message: 'Cart is Empty!' })
  return

}

export const DeleteCart = async (req: Request, res: Response, next: NextFunction) => {


  const customer = req.user;

  if (customer) {

    const profile = await Customer.findById(customer._id).populate('cart.food').exec();

    if (profile != null) {
      profile.cart = [] as any;
      const cartResult = await profile.save();

      res.status(200).json(cartResult);
      return
    }

  }

  res.status(400).json({ message: 'cart is Already Empty!' })
  return

}




export const CreateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  // const { txnId, amount, items } = <[OrderInputs]>req.body;
  console.log(customer);

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

    const foods = await Food.find()
      .where("_id")
      .in(cart.map((item) => item._id))
      .exec();

    foods.map((food) => {
      cart.map(({ _id, unit }) => {
        if (food._id == _id) {
          vendorId = food.vendorId;
          netAmount += food.price * unit;
          cartItems.push({ food, unit });
        }
      });
    });

    if (cartItems) {
      const currentOrder = await Order.create({
        orderId: orderId,
        vendorId: vendorId,
        items: cartItems,
        totalAmount: netAmount,
        // paidAmount: amount,
        orderDate: new Date(),
        paidThrough: "COD",
        paymentResponse: "",
        orderStatus: "Waiting",
        remarks: '',
        deliveryId: '',
        appliedOffer: false,
        offerId: null,
        readyTime: 45
      });

      if (currentOrder) {
        profile.orders.push(currentOrder);
        const profileResponse = await profile.save();
        res.status(200).json(profileResponse);
        return;
      }

      profile.cart = [] as any;
      profile.orders.push(currentOrder);

      //     currentTransaction.vendorId = vendorId;
      //     currentTransaction.orderId = orderId;
      //     currentTransaction.status = 'CONFIRMED'

      //     await currentTransaction.save();

      //     await assignOrderForDelivery(currentOrder._id, vendorId);

      //     const profileResponse =  await profile.save();

      //     return res.status(200).json(profileResponse);
    }
  }

  res.status(400).json({ msg: "Error while Creating Order" });
  return;
};

export const GetOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const customer = req.user;

  if (customer) {


    const profile = await Customer.findById(customer._id).populate("orders");
    if (profile) {
      res.status(200).json(profile.orders);
      return
    }

  }

  res.status(400).json({ msg: 'Orders not found' });
  return
};

export const GetOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.id;


  if (orderId) {


    const order = await Customer.findById(orderId).populate("items.food");

    if (order) {
      res.status(200).json(order);
      return
    }

  }

  res.status(400).json({ msg: 'Order not found' });
  return
};
