import mongoose, { Schema, Types } from "mongoose";

interface IAddress {
    state: string,
    city: string,
    areaAndStreet: string;
    locality?: string;
    pincode: number
}
interface ICart {
    productID: Types.ObjectId;
    quantity: number
}
interface IOrderHistory {
    orderID: Types.ObjectId;
    date: Date;
}
interface IUser {
    username: string;
    fullName: string,
    email: string;
    password: string;
    mobileNumber?: string;
    alternateMobileNumber?: string;
    address?: IAddress[];
    cart?: ICart[];
    role: "user" | "admin" | "superAdmin" | "superUser";
    wishlist?: Types.ObjectId[]
    orderHistory?: IOrderHistory[];

}

const userSchema = new Schema<IUser>({
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
            validator: function (num: string) {
                return /^[0-9]{10,11}$/.test(num);
            },
            message: (props: any) => `${props.value} is not a valid phone number!`
        }
    },
    alternateMobileNumber: {
        type: String,
        default: '6449933939',
        validate: {
            validator: function (num: string) {
                return /^[0-9]{10,11}$/.test(num);
            },
            message: (props: any) => `${props.value} is not a valid phone number!`
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
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    cart: {
        type: [
            {
                productID: {
                    type: mongoose.Schema.Types.ObjectId,
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
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Order' // Reference to the Order schema
                },
                date: {
                    type: Date,
                    default: Date.now
                }
            }]
    },
    role: {
        type: String,
        enum: ["user", "admin", "superAdmin", "superUser"],
        default: "user",
    },
},
    {
        timestamps: true
    })

export const UserModel = mongoose.model("UserModel", userSchema)

