import express, { json, urlencoded } from 'express';
import mongoose from "mongoose";
import userRouter from "./routes/users.router.js";

const app = express();
const PORT = 8080;

app.use(json());
app.use(urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://agustin:prueba123@cluster0.iviek.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {console.log("Conectado a Base de Datos")})
.catch(error => console.error("Error al Conectarse a la Base de Datos", error));

app.use("/api/users", userRouter)

app.listen(PORT, () => {
    console.log(`Ejecutándose en http://localhost:${PORT}`);
});
