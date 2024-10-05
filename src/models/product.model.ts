import mongoose, { ObjectId, Schema } from "mongoose";

interface Images {
    public_id: string;
    secure_url: string;
}
interface Ratings {
    star: number;
    postBy: ObjectId;
    comment: string
}
interface Discount {
    amountOff: number;
    startDate: Date;
    endDate: Date
}
interface Sizes {
    size: string;
    isSizeAvailable: boolean
}
interface IProduct {
    name: string;
    price: number;
    description: string;
    inStock: boolean;
    isPublished: boolean;
    slug: string;
    category: ObjectId;
    brand?: string;
    quantity: number;
    quantityLeft: number;
    colors?: string[];
    images: Images[];
    productOwner: ObjectId;
    ratings?: Ratings[];
    discount?: Discount[];
    sizes?: Sizes[];
    discountPrice?: number;
    thumbnail: any;
}

const productSchema = new Schema<IProduct>({

    name: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 1,
    },
    description: {
        type: String,
        required: true,
        trim: true
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
        type: mongoose.Schema.Types.ObjectId,
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
            validator: function (v: any) {
                console.log("Product.model.ts")
                console.log(v);
                return v.length <= 1
            },
            message: (props: any) => `The images array must contain at least 2 elements. Currently has ${props.value.length}.`
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
        type: mongoose.Schema.Types.ObjectId,
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
                    type: mongoose.Schema.Types.ObjectId,
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
    }
    ,
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
    discountPrice: {
        type: Number,
        required: true,
    },
},
    {
        timestamps: true
    }
)

export const ProductModel = mongoose.model("ProductModel", productSchema)