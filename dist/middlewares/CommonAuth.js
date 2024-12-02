"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authenticate = void 0;
var utility_1 = require("../utility");
var Authenticate = function (req, res, next) {
    var validateSignature = (0, utility_1.ValidateSignature)(req);
    if (validateSignature) {
        next();
    }
    else {
        res.status(401).json({ message: "User not Authorized" });
    }
};
exports.Authenticate = Authenticate;
//# sourceMappingURL=CommonAuth.js.map