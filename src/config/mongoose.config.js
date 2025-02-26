import { connect, Types } from "mongoose";
import "dotenv/config";

export const connectDB = async () => {
    const URL = process.env.MONGO_URL;

    try {
        await connect(URL);
        console.log("Conectado a MongoDB");
    } catch (error) {
        console.log("Error al conectar con MongoDB", error.message);
    }
};

export const isValidID = (id) => {
    return Types.ObjectId.isValid(id);
};