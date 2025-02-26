import passport from "passport";
import local from "passport-local";
import jwt from "passport-jwt";
import { createHash, isValidPassword } from "../utils/hashCreator.js";
import ProductModel from "../models/product.model.js";
import CartModel from "../models/cart.model.js";

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
const LocalStrategy = local.Strategy;

export const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const findCart = async () => {
          try {
            const cart = await CartModel.findById("67a35293b5559af297bc1c05");
            return cart;
          } catch (error) {
            console.log(error.message);
          }
        };
        const { first_name, last_name, email } = req.body;
        try {
          const user = await ProductModel.findOne({ email: username });
          if (user) {
            console.log("Usuario ya existe");
            return done(null, false);
          }
          const newUser = {
            first_name,
            last_name,
            email,
            password: createHash(password),
            cart: await findCart(),
          };
          const result = await ProductModel.create(newUser);
          return done(null, result);
        } catch (error) {
          return done("Error al crear un usuario " + error.message);
        }
      }
    )
  );
  passport.use(
    "login",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          const userExist = await ProductModel.findOne({ email: username });

          if (!userExist) return done(null, false);
          const isValid = await isValidPassword(password, userExist.password);

          if (!isValid) {
            return done(null, false);
          } else {
            return done(null, userExist);
          }
        } catch (error) {
          return done("Error al crear un usuario " + error.message);
        }
      }
    )
  );
  passport.use(
    "current",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: "clave-secreta",
      },
      async (jwt_payload, done) => {
        try {
          return done(null, jwt_payload);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = await ProductModel.findById(id);
    done(null, user);
  });
};
const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    {
      token = req.cookies["authCookie"];
    }
  }
  return token;
};
