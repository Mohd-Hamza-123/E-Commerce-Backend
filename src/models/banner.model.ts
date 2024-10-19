import mongoose, { Schema } from "mongoose";

const bannerSchema = new Schema(
    {
        crousal_Images: {
            type: [
                {
                    public_id: {
                        type: String,
                    },
                    secure_url: {
                        type: String
                    }
                }
            ],
            _id: false,
            require: true,
            validate: {
                validator: function (x: any) {
                    return x?.length <= 10
                },
                message: (props: any) => `Images should be less than equal to ${props.value.length}`
            }
        },
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserModel'
        },
    }
)

export const BannerModel = mongoose.model('BannerModel', bannerSchema)