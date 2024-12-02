"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var OrderSchema = new mongoose_1.Schema({
    orderId: { type: String, require: true },
    // vendorId: { type: String, require: true },
    items: [
        {
            food: { type: mongoose_1.Schema.Types.ObjectId, ref: "food", require: true },
            unit: { type: Number, require: true },
        },
    ],
    totalAmount: { type: Number, require: true },
    // paidAmount: { type: Number, require: true },
    orderDate: { type: Date },
    paidThrough: { type: String },
    paymentResponse: { type: String },
    orderStatus: { type: String },
    // remarks: { type: String },
    // deliveryId: { type: String },
    // readyTime: { type: Number },
}, {
    toJSON: {
        transform: function (doc, ret) {
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        },
    },
    timestamps: true,
});
var Order = mongoose_1.default.model("order", OrderSchema);
exports.Order = Order;
//# sourceMappingURL=Order.js.map