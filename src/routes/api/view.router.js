import { Router } from "express";
import passport from "passport";

const viewRoutes = Router();

viewRoutes.get("/registerUser", (req, res) => {res.render("registerUser", { title: "REGISTER" })});

viewRoutes.get("/login", (req, res) => { res.render("login", { title: "LOGIN" })});

viewRoutes.get("/profile", passport.authenticate("current", { session: false }), (req, res) => {const user = req.user;res.render("profile", { title: "PROFILE", user: user })});

export default viewRoutes;

