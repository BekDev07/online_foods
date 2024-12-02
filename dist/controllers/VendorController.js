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
exports.GetFoods = exports.AddFood = exports.UpdateVendorCoverImage = exports.UpdateProfileService = exports.UpdateProfile = exports.GetVendorProfile = exports.VendorLogin = void 0;
var AdminController_1 = require("./AdminController");
var utility_1 = require("../utility");
var Food_1 = require("../models/Food");
var VendorLogin = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, existingUser, validation, signature;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, (0, AdminController_1.FindVendor)("", email)];
            case 1:
                existingUser = _b.sent();
                if (!(existingUser !== null)) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, utility_1.ValidatePassword)(password, existingUser.password, existingUser.salt)];
            case 2:
                validation = _b.sent();
                if (validation) {
                    signature = (0, utility_1.GenerateSignature)({
                        _id: existingUser._id,
                        email: existingUser.email,
                        name: existingUser.name,
                        foodType: existingUser.foodType,
                    });
                    res.json(signature);
                    return [2 /*return*/];
                }
                else {
                    res.status(400).json({ message: "Username or password is not valid!" });
                    return [2 /*return*/];
                }
                _b.label = 3;
            case 3:
                res.json({ message: "Login credential is not valid" });
                return [2 /*return*/];
        }
    });
}); };
exports.VendorLogin = VendorLogin;
var GetVendorProfile = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, existingVendor;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                if (!user) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, AdminController_1.FindVendor)(user._id)];
            case 1:
                existingVendor = _a.sent();
                res.status(200).json(existingVendor);
                return [2 /*return*/];
            case 2:
                // ValidateSignature(req);
                res.status(401).json({ message: "Vendor not Found" });
                return [2 /*return*/];
        }
    });
}); };
exports.GetVendorProfile = GetVendorProfile;
var UpdateProfile = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, name, address, foodTypes, phone, existingVendor, savedResult;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                user = req.user;
                _a = req.body, name = _a.name, address = _a.address, foodTypes = _a.foodTypes, phone = _a.phone;
                if (!user) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, AdminController_1.FindVendor)(user._id)];
            case 1:
                existingVendor = _b.sent();
                if (!existingVendor) return [3 /*break*/, 3];
                existingVendor.name = name;
                existingVendor.address = address;
                existingVendor.foodType = foodTypes;
                existingVendor.phone = phone;
                return [4 /*yield*/, existingVendor.save()];
            case 2:
                savedResult = _b.sent();
                res.json(savedResult);
                return [2 /*return*/];
            case 3:
                res.status(200).json(existingVendor);
                return [2 /*return*/];
            case 4:
                res.status(401).json({ message: "Vendor not Found" });
                return [2 /*return*/];
        }
    });
}); };
exports.UpdateProfile = UpdateProfile;
var UpdateProfileService = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, existingVendor, savedResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                if (!user) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, AdminController_1.FindVendor)(user._id)];
            case 1:
                existingVendor = _a.sent();
                if (!existingVendor) return [3 /*break*/, 3];
                existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
                return [4 /*yield*/, existingVendor.save()];
            case 2:
                savedResult = _a.sent();
                res.json(savedResult);
                return [2 /*return*/];
            case 3:
                res.status(200).json(existingVendor);
                return [2 /*return*/];
            case 4:
                res.status(401).json({ message: "Vendor not Found" });
                return [2 /*return*/];
        }
    });
}); };
exports.UpdateProfileService = UpdateProfileService;
var UpdateVendorCoverImage = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, vendor, files, images, result, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                user = req.user;
                if (!user) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, AdminController_1.FindVendor)(user._id)];
            case 1:
                vendor = _b.sent();
                if (!vendor) return [3 /*break*/, 3];
                files = req.files;
                console.log(files);
                images = files.map(function (file) { return file.originalname; });
                console.log(images);
                (_a = vendor.coverImages).push.apply(_a, images);
                return [4 /*yield*/, vendor.save()];
            case 2:
                result = _b.sent();
                res.json(result);
                return [2 /*return*/];
            case 3:
                res.json({ message: "Vendor not Found" });
                return [3 /*break*/, 5];
            case 4:
                error_1 = _b.sent();
                console.error("bizning xato: ", error_1);
                return [3 /*break*/, 5];
            case 5:
                res.status(401).json({ message: "Vendor not Found" });
                return [2 /*return*/];
        }
    });
}); };
exports.UpdateVendorCoverImage = UpdateVendorCoverImage;
var AddFood = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, name_1, description, category, foodType, readyTime, price, vendor, files, images, createdFood, result, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                user = req.user;
                if (!user) return [3 /*break*/, 4];
                _a = req.body, name_1 = _a.name, description = _a.description, category = _a.category, foodType = _a.foodType, readyTime = _a.readyTime, price = _a.price;
                return [4 /*yield*/, (0, AdminController_1.FindVendor)(user._id)];
            case 1:
                vendor = _b.sent();
                if (!vendor) return [3 /*break*/, 4];
                files = req.files;
                images = files.map(function (file) { return file.originalname; });
                return [4 /*yield*/, Food_1.Food.create({
                        vendorId: vendor._id,
                        name: name_1,
                        description: description,
                        category: category,
                        foodType: foodType,
                        images: images,
                        readyTime: readyTime,
                        price: price,
                        rating: 0,
                    })];
            case 2:
                createdFood = _b.sent();
                vendor.foods.push(createdFood);
                return [4 /*yield*/, vendor.save()];
            case 3:
                result = _b.sent();
                res.json(result);
                return [2 /*return*/];
            case 4:
                res.json({ message: "Vendor not Found" });
                return [3 /*break*/, 6];
            case 5:
                error_2 = _b.sent();
                console.error(error_2);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.AddFood = AddFood;
var GetFoods = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, foods;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                if (!user) return [3 /*break*/, 2];
                return [4 /*yield*/, Food_1.Food.find({ vendorId: user._id })];
            case 1:
                foods = _a.sent();
                if (foods) {
                    res.json(foods);
                    return [2 /*return*/];
                }
                _a.label = 2;
            case 2:
                res.json({ message: "Food information not found" });
                return [2 /*return*/];
        }
    });
}); };
exports.GetFoods = GetFoods;
//# sourceMappingURL=VendorController.js.map