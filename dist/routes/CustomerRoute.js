"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoute = void 0;
var express_1 = __importDefault(require("express"));
var CustomerController_1 = require("../controllers/CustomerController");
// import { AddToCart, CreateOrder, CreatePayment, CustomerLogin, CustomerSignUp, CustomerVerify, DeleteCart, EditCustomerProfile, GetCart, GetCustomerProfile, GetOrderById, GetOrders, RequestOtp, VerifyOffer } from '../controllers';
// import { Authenticate } from '../middleware';
// import { Offer } from '../models/Offer';
var router = express_1.default.Router();
exports.CustomerRoute = router;
/* ------------------- Suignup / Create Customer --------------------- */
router.post('/signup', CustomerController_1.CustomerSignUp);
/* ------------------- Login --------------------- */
router.post('/login', CustomerController_1.CustomerLogin);
/* ------------------- Authentication --------------------- */
// router.use(Authenticate);
/* ------------------- Verify Customer Account --------------------- */
router.patch('/verify', CustomerController_1.CustomerVerify);
/* ------------------- OTP / request OTP --------------------- */
router.get('/otp', CustomerController_1.RequestOtp);
/* ------------------- Profile --------------------- */
router.get('/profile', CustomerController_1.GetCustomerProfile);
router.patch('/profile', CustomerController_1.EditCustomerProfile);
// //Cart
// router.post('/cart', AddToCart)
// router.get('/cart', GetCart)
// router.delete('/cart', DeleteCart)
// //Apply Offers
// router.get('/offer/verify/:id', VerifyOffer);
// //Payment
// router.post('/create-payment', CreatePayment);
//Order
router.post('/create-order', CustomerController_1.CreateOrder);
router.get('/orders', CustomerController_1.GetOrders);
router.get('/order/:id', CustomerController_1.GetOrderById);
//# sourceMappingURL=CustomerRoute.js.map