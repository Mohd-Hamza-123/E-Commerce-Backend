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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    fullName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    mobileNumber: {
        type: String,
        default: '9794442292',
        validate: {
            validator: function (num) {
                return /^[0-9]{10,11}$/.test(num);
            },
            message: (props) => `${props.value} is not a valid phone number!`
        }
    },
    alternateMobileNumber: {
        type: String,
        default: '6449933939',
        validate: {
            validator: function (num) {
                return /^[0-9]{10,11}$/.test(num);
            },
            message: (props) => `${props.value} is not a valid phone number!`
        }
    },
    address: {
        type: [
            {
                state: {
                    type: String,
                    enum: ["Uttar Pradesh"],
                    required: false,
                },
                city: {
                    type: String,
                    required: true,
                    enum: ["Prayagraj", "Varansi"],
                    default: "Prayagraj"
                },
                areaAndStreet: {
                    type: String,
                    required: true
                },
                locality: {
                    type: String,
                    required: false,
                    default: "Kareli"
                },
                pincode: {
                    type: Number,
                    required: true
                },
            }
        ],
        id: false
    },
    wishlist: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    cart: {
        type: [
            {
                productID: {
                    type: mongoose_1.default.Schema.Types.ObjectId,
                    ref: 'Product'
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                    default: 1,
                },
                totalAmount: {
                    type: Number,
                    default: 0,
                    min: 0
                },
            }
        ],
        required: false,
    },
    orderHistory: {
        type: [
            {
                orderID: {
                    type: mongoose_1.default.Schema.Types.ObjectId,
                    ref: 'Order' // Reference to the Order schema
                },
                date: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    role: {
        type: String,
        enum: ["user", "admin", "superAdmin", "superUser"],
        default: "user",
    },
}, {
    timestamps: true
});
exports.UserModel = mongoose_1.default.model("UserModel", userSchema);
