import { Router } from "express";
import passport from "passport";

const router = Router();

router.get("/registerUser", (req, res) => {res.render("registerUser", { title: "REGISTER" })});

router.get("/login", (req, res) => { res.render("login", { title: "LOGIN" })});

router.get("/profile", passport.authenticate("current", { session: false }), (req, res) => {const user = req.user;res.render("profile", { title: "PROFILE", user: user })});

export default router;

