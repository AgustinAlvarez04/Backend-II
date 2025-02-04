import mongoose from "mongoose";

const userCollection = "usuarios";

const useSchema = new mongoose.Schema({
    first_name:{type: String, required:true, max: 100},
    last_name:{type: String, required:true, max: 100},
    email:{type: String, required:true, max: 100}
})

const userModel = mongoose.model(userCollection, useSchema)

export default userModel