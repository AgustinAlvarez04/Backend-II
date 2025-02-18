import express from "express";
import { config as configHandlebars } from "./config/handlebars.config.js";
import { config as configWebsocket } from "./config/websocket.config.js";
import { connectDB } from "./config/mongoose.config.js";


import path from "./utils/paths.js";
import routerViewHome from "./routes/app/home.router.js";
import routerProducts from "./routes/app/products.router.js";
import routerCart from "./routes/app/carts.router.js";
import routerApiProducts from "./routes/api/products.router.js";
import routerApiCart from "./routes/api/cart.router.js";

// Se crea una instancia de la aplicación Express
const app = express();

// Se define el puerto en el que el servidor escuchará las solicitudes
const PORT = 8080;

// Conexión con la Base de Datos del Cloud de MongoDB
connectDB();
app.use("/public", express.static(path.public));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

configHandlebars(app);

app.use("/", routerViewHome);
app.use("/products", routerProducts);
app.use("/carts", routerCart);
app.use("/api/products", routerApiProducts);
app.use("/api/carts", routerApiCart);

app.use("*", (req, res) => {
	res.status(404).render("error404", { title: "Error 404" });
});

// Se levanta el servidor oyendo en el puerto definido
const httpServer = app.listen(PORT, () => {
    console.log(`Ejecutándose en http://localhost:${PORT}`);
});

// Configuración del servidor de websocket
configWebsocket(httpServer);