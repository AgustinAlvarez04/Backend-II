import Cart from "../daos/mongo/classes/cart.dao.js";
import User from "../daos/mongo/classes/user.dao.js";

import UserRepository from "../repositories/user.repository.js";
import CartRepository from "../repositories/cart.repository.js";

import { createHash, isValidPassword } from "../utils/hashCreator.js";

const cartService = new CartRepository(new Cart());
const userService = new UserRepository(new User());

export const passportRegister = async (req, username, password, done) => {
  const { name, last_name, email, role } = req.body;
  try {
    const newCart = await cartService.createCart();
    const user = await userService.getUser({ email: username });
    if (user) {
      console.log("Existing User");
      return done(null, false);
    }

    const newUser = {
      name,
      last_name,
      email,
      role,
      contraseña: createHash(password),
      cart: newCart._id,
    };

    const result = await userService.createUser(newUser);
    return done(null, result);

  } catch (error) {
    return done("Error Creating User", error.message);
  }
};

export const passportLogin = async (req, username, password, done) => {
  try {
    const userExist = await userService.getUser({ email: username });
    if (!userExist) return done(null, false);

    const isValid = await isValidPassword(password, userExist.password);
    if (!isValid) {
      return done(null, false);
    } else {
      return done(null, userExist);
    }

  } catch (error) {
    return done("Error Creating User", error.message);
  }
};

export const passportCurrent = async (jwt_payload, done) => {
  try {
    const user = await userService.getUserById(jwt_payload._id);
    if (!user) return done(null, false);

    return done(null, user);
  } catch (error) {
    return done(error);
  }
};
