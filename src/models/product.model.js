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
exports.ProductModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discountPrice: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    inStock: {
        type: Boolean,
        required: true,
        default: true
    },
    isPublished: {
        type: Boolean,
        required: true,
        default: false
    },
    slug: {
        type: String,
        required: false,
        trim: true,
    },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "CategoryModel"
    },
    brand: {
        type: String,
        required: false,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    quantityLeft: {
        type: Number,
        min: 0,
        default: null
    },
    colors: {
        type: [String],
        required: false,
    },
    thumbnail: {
        type: [{
                public_id: {
                    type: String
                },
                secure_url: {
                    type: String
                }
            }],
        _id: false,
        required: true,
        validate: {
            validator: function (v) {
                console.log("Product.model.ts");
                console.log(v);
                return v.length <= 1;
            },
            message: (props) => `The images array must contain at least 2 elements. Currently has ${props.value.length}.`
        }
    },
    images: {
        type: [
            {
                public_id: {
                    type: String,
                    required: true
                },
                secure_url: {
                    type: String,
                    required: true
                }
            },
        ],
        required: false,
        _id: false,
    },
    productOwner: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "UserModel",
        required: true
    },
    ratings: {
        type: [
            {
                star: {
                    type: Number,
                    min: 0,
                    max: 5,
                    required: false
                },
                postBy: {
                    type: mongoose_1.default.Schema.Types.ObjectId,
                    ref: "UserModel",
                    required: false
                },
                comment: {
                    type: String,
                    required: false
                },
            }
        ],
        required: false,
        default: []
    },
    discount: {
        type: {
            discountOff: {
                type: String,
                required: false
            },
            startDate: {
                type: Date,
                required: false
            },
            endDate: {
                type: Date,
                required: false
            },
            _id: false
        },
        default: null
    },
    sizes: {
        type: [String],
        _id: false,
        required: false,
    },
}, {
    timestamps: true
});
exports.ProductModel = mongoose_1.default.model("ProductModel", productSchema);
