"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRoutes = void 0;
var express_1 = __importDefault(require("express"));
var controllers_1 = require("../controllers");
var middlewares_1 = require("../middlewares");
var multer_1 = __importDefault(require("multer"));
var path_1 = __importDefault(require("path"));
var router = express_1.default.Router();
exports.VendorRoutes = router;
var imageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        var dir = path_1.default.join(__dirname, "../images");
        console.log("Saving file to directory:", dir); // Debug
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        var uniqueName = new Date().toISOString().replace(/:/g, "-") + "_" + file.originalname;
        console.log("Generated file name:", uniqueName); // Debug
        cb(null, uniqueName);
    },
});
var images = (0, multer_1.default)({ storage: imageStorage }).array("images", 10);
router.post("/login", controllers_1.VendorLogin);
router.use(middlewares_1.Authenticate);
router.get("/profile", controllers_1.GetVendorProfile);
router.patch("/coverImage", images, controllers_1.UpdateVendorCoverImage);
router.patch("/profile", controllers_1.UpdateProfile);
router.patch("/service", controllers_1.UpdateProfileService);
router.post("/food", images, controllers_1.AddFood);
router.get("/foods", controllers_1.GetFoods);
router.get("/", function (req, res) {
    res.json({ message: "Hello, world from Vendor!" });
});
//# sourceMappingURL=VendorRoutes.js.map