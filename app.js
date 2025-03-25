import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import env from "./config/env.js"
import MongoStore from "connect-mongo";

import { connectDB } from "./config/mongoose.config.js";
import { initializePassport } from "./config/passport.config.js";
import { config as configHandlebars } from "./config/handlebars.config.js";
import { config as configWebsocket } from "./config/websocket.config.js";

import path from "./utils/paths.js";

import cartRoutes from "./routes/api/cart.router.js";
import productsRoutes from "./routes/api/products.router.js";
import userRoutes from "./routes/api/user.router.js";
import viewRoutes from "./routes/api/view.router.js"

const app = express();
const PORT = 7100;

configHandlebars(app);
connectDB();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionConfig = {
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL, 
      crypto: { secret: process.env.SECRET_KEY },
      ttl: 30,
    }),
    secret: process.env.SECRET_KEY,
    saveUninitialized: true,
    resave: false,
  };

app.use(session(sessionConfig));
app.use("/public", express.static(path.public));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());


app.get("/", (req, res) => {res.render("home", { title: "HOME" }) });

app.use("/api/cart", cartRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/views", viewRoutes);


const httpServer = app.listen(PORT, () => {
    console.log(`Ejecutándose en http://localhost:${PORT}`);
});

configWebsocket(httpServer);