import mongoose from 'mongoose';
const { Schema, model, models, SchemaTypes } = mongoose;

const UserSchema = new Schema({
    first_name: {
        type: String,
        required: true,
        unique: true
    },
    last_name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    age: {
        type: Number,
    },
    password: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        default: "user",
        trim: true,
    },
    cart: { type: SchemaTypes.ObjectId, ref: "Carts" },
});


export default models.User || model("User", UserSchema);