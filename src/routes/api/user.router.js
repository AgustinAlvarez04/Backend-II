import { Router } from "express";
import passport from "passport";
import { createToken } from "../../utils/createToken.js";

const userRoutes = Router();

userRoutes.post("/registerUser", passport.authenticate("registerUser", { session: false }), async (req, res) => {res.redirect("/login")});

userRoutes.post("/login", passport.authenticate("login", {session: false}), async (req, res) => {
  const user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
    };
    const token = createToken(user);
    try {
      res.cookie("authCookie", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
      });
      res.redirect("/profile");
    } catch (error) {
      res.send("Error: " + error.message);
    }
  }
);
userRoutes.get("/current",passport.authenticate("current", { session: false }), (req, res) => {res.send(req.user)});
export default userRoutes;
