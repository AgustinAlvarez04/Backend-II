import passport from "passport";
import local from "passport-local";
import jwt from "passport-jwt";

import env from "./env.js";
import User from "../daos/mongo/classes/user.dao.js";

import { passportLogin, passportRegister, passportCurrent } from "../controllers/passport.controllers.js";

const userService = new User();
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
const LocalStrategy = local.Strategy;

export const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email",
        passwordField: "password",
      },passportRegister));

  passport.use(
    "login",
    new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email",
      },passportLogin));

  passport.use(
    "current",
    new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: "secret-key" || env.token_key,
      },passportCurrent));

  passport.serializeUser((user, done) => {
    done(null, user._id)});

  passport.deserializeUser(async (id, done) => {
    const user = await userService.getUserById(id);
    done(null, user)});
};

export const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {{token = req.cookies["authCookie"]}};
  return token;
};
