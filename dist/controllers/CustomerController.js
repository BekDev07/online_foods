"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOrderById = exports.GetOrders = exports.CreateOrder = exports.EditCustomerProfile = exports.GetCustomerProfile = exports.RequestOtp = exports.CustomerVerify = exports.CustomerLogin = exports.CustomerSignUp = void 0;
var class_transformer_1 = require("class-transformer");
var Customer_dto_1 = require("../dto/Customer.dto");
var class_validator_1 = require("class-validator");
var Customer_1 = require("../models/Customer");
var passwordUtility_1 = require("../utility/passwordUtility");
var NotificationUtility_1 = require("../utility/NotificationUtility");
var Food_1 = require("../models/Food");
var Order_1 = require("../models/Order");
var CustomerSignUp = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerInputs, validationError, email, phone, password, salt, userPassword, _a, otp, expiry, existingCustomer, result, signature;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                customerInputs = (0, class_transformer_1.plainToClass)(Customer_dto_1.CreateCustomerInput, req.body);
                return [4 /*yield*/, (0, class_validator_1.validate)(customerInputs, {
                        validationError: { target: true },
                    })];
            case 1:
                validationError = _b.sent();
                if (validationError.length > 0) {
                    res.status(400).json(validationError);
                    return [2 /*return*/];
                }
                email = customerInputs.email, phone = customerInputs.phone, password = customerInputs.password;
                return [4 /*yield*/, (0, passwordUtility_1.GenerateSalt)()];
            case 2:
                salt = _b.sent();
                return [4 /*yield*/, (0, passwordUtility_1.GeneratePassword)(password, salt)];
            case 3:
                userPassword = _b.sent();
                _a = (0, NotificationUtility_1.GenerateOtp)(), otp = _a.otp, expiry = _a.expiry;
                return [4 /*yield*/, Customer_1.Customer.find({ email: email })];
            case 4:
                existingCustomer = _b.sent();
                if (existingCustomer.length > 0) {
                    res.status(400).json({ message: "Email already exist!" });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, Customer_1.Customer.create({
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
                    })];
            case 5:
                result = _b.sent();
                if (!result) return [3 /*break*/, 7];
                return [4 /*yield*/, (0, NotificationUtility_1.onRequestOTP)(otp, phone)];
            case 6:
                _b.sent();
                signature = (0, passwordUtility_1.GenerateSignature)({
                    _id: result._id,
                    email: result.email,
                    verified: result.verified,
                });
                res
                    .status(201)
                    .json({ signature: signature, verified: result.verified, email: result.email });
                return [2 /*return*/];
            case 7:
                res.status(400).json({ msg: "Error while creating user" });
                return [2 /*return*/];
        }
    });
}); };
exports.CustomerSignUp = CustomerSignUp;
var CustomerLogin = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerInputs, validationError, email, password, customer, validation, signature;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                customerInputs = (0, class_transformer_1.plainToClass)(Customer_dto_1.UserLoginInput, req.body);
                return [4 /*yield*/, (0, class_validator_1.validate)(customerInputs, {
                        validationError: { target: true },
                    })];
            case 1:
                validationError = _a.sent();
                if (validationError.length > 0) {
                    res.status(400).json(validationError);
                    return [2 /*return*/];
                }
                email = customerInputs.email, password = customerInputs.password;
                return [4 /*yield*/, Customer_1.Customer.findOne({ email: email })];
            case 2:
                customer = _a.sent();
                if (!customer) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, passwordUtility_1.ValidatePassword)(password, customer.password, customer.salt)];
            case 3:
                validation = _a.sent();
                if (validation) {
                    signature = (0, passwordUtility_1.GenerateSignature)({
                        _id: customer._id,
                        email: customer.email,
                        verified: customer.verified,
                    });
                    res.status(200).json({
                        signature: signature,
                        email: customer.email,
                        verified: customer.verified,
                    });
                    return [2 /*return*/];
                }
                _a.label = 4;
            case 4:
                res.json({ msg: "Error With Signup" });
                return [2 /*return*/];
        }
    });
}); };
exports.CustomerLogin = CustomerLogin;
var CustomerVerify = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var otp, customer, profile, updatedCustomerResponse, signature;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                otp = req.body.otp;
                customer = req.user;
                if (!customer) return [3 /*break*/, 3];
                return [4 /*yield*/, Customer_1.Customer.findById(customer._id)];
            case 1:
                profile = _a.sent();
                if (!profile) return [3 /*break*/, 3];
                if (!(profile.otp === parseInt(otp) && profile.otp_expiry >= new Date())) return [3 /*break*/, 3];
                profile.verified = true;
                return [4 /*yield*/, profile.save()];
            case 2:
                updatedCustomerResponse = _a.sent();
                signature = (0, passwordUtility_1.GenerateSignature)({
                    _id: updatedCustomerResponse._id,
                    email: updatedCustomerResponse.email,
                    verified: updatedCustomerResponse.verified,
                });
                res.status(200).json({
                    signature: signature,
                    email: updatedCustomerResponse.email,
                    verified: updatedCustomerResponse.verified,
                });
                return [2 /*return*/];
            case 3:
                res.status(400).json({ msg: "Unable to verify Customer" });
                return [2 /*return*/];
        }
    });
}); };
exports.CustomerVerify = CustomerVerify;
var RequestOtp = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, profile, _a, otp, expiry, sendCode;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                customer = req.user;
                if (!customer) return [3 /*break*/, 4];
                return [4 /*yield*/, Customer_1.Customer.findById(customer._id)];
            case 1:
                profile = _b.sent();
                if (!profile) return [3 /*break*/, 4];
                _a = (0, NotificationUtility_1.GenerateOtp)(), otp = _a.otp, expiry = _a.expiry;
                profile.otp = otp;
                profile.otp_expiry = expiry;
                return [4 /*yield*/, profile.save()];
            case 2:
                _b.sent();
                return [4 /*yield*/, (0, NotificationUtility_1.onRequestOTP)(otp, profile.phone)];
            case 3:
                sendCode = _b.sent();
                if (!sendCode) {
                    res.status(400).json({ message: "Failed to verify your phone number" });
                    return [2 /*return*/];
                }
                res
                    .status(200)
                    .json({ message: "OTP sent to your registered Mobile Number!" });
                return [2 /*return*/];
            case 4:
                res.status(400).json({ msg: "Error with Requesting OTP" });
                return [2 /*return*/];
        }
    });
}); };
exports.RequestOtp = RequestOtp;
var GetCustomerProfile = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, profile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                customer = req.user;
                if (!customer) return [3 /*break*/, 2];
                return [4 /*yield*/, Customer_1.Customer.findById(customer._id)];
            case 1:
                profile = _a.sent();
                if (profile) {
                    res.status(201).json(profile);
                    return [2 /*return*/];
                }
                _a.label = 2;
            case 2:
                res.status(400).json({ msg: "Error while Fetching Profile" });
                return [2 /*return*/];
        }
    });
}); };
exports.GetCustomerProfile = GetCustomerProfile;
var EditCustomerProfile = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, customerInputs, validationError, firstName, lastName, address, profile, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                customer = req.user;
                customerInputs = (0, class_transformer_1.plainToClass)(Customer_dto_1.EditCustomerProfileInput, req.body);
                return [4 /*yield*/, (0, class_validator_1.validate)(customerInputs, {
                        validationError: { target: true },
                    })];
            case 1:
                validationError = _a.sent();
                if (validationError.length > 0) {
                    res.status(400).json(validationError);
                    return [2 /*return*/];
                }
                firstName = customerInputs.firstName, lastName = customerInputs.lastName, address = customerInputs.address;
                if (!customer) return [3 /*break*/, 4];
                return [4 /*yield*/, Customer_1.Customer.findById(customer._id)];
            case 2:
                profile = _a.sent();
                if (!profile) return [3 /*break*/, 4];
                profile.firstName = firstName;
                profile.lastName = lastName;
                profile.address = address;
                return [4 /*yield*/, profile.save()];
            case 3:
                result = _a.sent();
                res.status(201).json(result);
                return [2 /*return*/];
            case 4:
                res.status(400).json({ msg: "Error while Updating Profile" });
                return [2 /*return*/];
        }
    });
}); };
exports.EditCustomerProfile = EditCustomerProfile;
var CreateOrder = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, profile, orderId, cart_1, cartItems_1, netAmount_1, vendorId, foods, currentOrder, profileResponse;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                customer = req.user;
                // const { txnId, amount, items } = <[OrderInputs]>req.body;
                console.log(customer);
                if (!customer) return [3 /*break*/, 5];
                return [4 /*yield*/, Customer_1.Customer.findById(customer._id)];
            case 1:
                profile = _a.sent();
                orderId = "".concat(Math.floor(Math.random() * 89999) + 1000);
                cart_1 = req.body;
                cartItems_1 = Array();
                netAmount_1 = 0.0;
                vendorId = void 0;
                return [4 /*yield*/, Food_1.Food.find()
                        .where("_id")
                        .in(cart_1.map(function (item) { return item._id; }))
                        .exec()];
            case 2:
                foods = _a.sent();
                foods.map(function (food) {
                    cart_1.map(function (_a) {
                        var _id = _a._id, unit = _a.unit;
                        if (food._id == _id) {
                            // vendorId = food.vendorId;
                            netAmount_1 += food.price * unit;
                            cartItems_1.push({ food: food, unit: unit });
                        }
                    });
                });
                if (!cartItems_1) return [3 /*break*/, 5];
                return [4 /*yield*/, Order_1.Order.create({
                        orderId: orderId,
                        vendorId: vendorId,
                        items: cartItems_1,
                        totalAmount: netAmount_1,
                        // paidAmount: amount,
                        orderDate: new Date(),
                        paidThrough: "COD",
                        paymentResponse: "",
                        orderStatus: "Waiting",
                        // remarks: '',
                        // deliveryId: '',
                        // readyTime: 45
                    })];
            case 3:
                currentOrder = _a.sent();
                if (!currentOrder) return [3 /*break*/, 5];
                profile.orders.push(currentOrder);
                return [4 /*yield*/, profile.save()];
            case 4:
                profileResponse = _a.sent();
                res.status(200).json(profileResponse);
                return [2 /*return*/];
            case 5:
                res.status(400).json({ msg: "Error while Creating Order" });
                return [2 /*return*/];
        }
    });
}); };
exports.CreateOrder = CreateOrder;
var GetOrders = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/];
}); }); };
exports.GetOrders = GetOrders;
var GetOrderById = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/];
}); }); };
exports.GetOrderById = GetOrderById;
//# sourceMappingURL=CustomerController.js.map