import express from "express";
import cookieParser from "cookie-parser";
import { engine } from "express-handlebars";
import passport from "passport";
import { connectDB } from "./config/mongoose.config.js";
import { initializePassport } from "./config/passport.config.js";
import { config as configHandlebars } from "./config/handlebars.config.js";
import { config as configWebsocket } from "./config/websocket.config.js";
import "dotenv/config";

import path from "./utils/paths.js";
import routerViewHome from "./routes/app/home.router.js";
import routerProducts from "./routes/app/products.router.js";
import routerCart from "./routes/app/carts.router.js";
import routerUsers from "./routes/api/view.router.js";
import routerApiProducts from "./routes/api/products.router.js";
import routerApiCart from "./routes/api/cart.router.js";
import routerApiUser from "./routes/api/user.router.js";

const app = express();
const PORT = 8080;
configHandlebars(app);
connectDB();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.public));
app.use(express.json());
initializePassport();
app.use(passport.initialize());


app.get("/", (req, res) => {res.render("home", { title: "HOME" }) });
// app.use("/", routerViewHome);
app.use("/products", routerProducts);
app.use("/carts", routerCart);
app.use("/users", routerUsers);
app.use("/api/products", routerApiProducts);
app.use("/api/carts", routerApiCart);
app.use("/api/user", routerApiUser);

app.use("*", (req, res) => {
	res.status(404).render("error404", { title: "Error 404" });
});


const httpServer = app.listen(PORT, () => {
    console.log(`Ejecutándose en http://localhost:${PORT}`);
});

configWebsocket(httpServer);