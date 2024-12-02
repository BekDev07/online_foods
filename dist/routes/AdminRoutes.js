"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
var express_1 = __importDefault(require("express"));
var controllers_1 = require("../controllers");
var router = express_1.default.Router();
exports.AdminRoutes = router;
router.post("/vendor", controllers_1.CreateVendor);
router.get("/vendors", controllers_1.GetVendors);
router.get("/vendors/:id", controllers_1.GetVendorByID);
//# sourceMappingURL=AdminRoutes.js.map