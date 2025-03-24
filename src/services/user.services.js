import { userDao } from "../daos/user.manager.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";

import jwt from "jsonwebtoken";
import "dotenv/config";

const SECRET_KEY = process.env.SECRET_KEY;

export const generateToken = (user) => {
  const payload = {
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, SECRET_KEY, { expiresIn: "15m" });
};

export const register = async (user) => {
  try {
    const { email, password } = user;
    const existUser = await userDao.getByEmail(email);
    if (existUser) throw new Error("User already exist");
    if (email === "adminCoder@coder" && password === "adminCod3r123") {
      return await userDao.register({
        ...user,
        password: createHash(password),
        role: "admin",
      });
    }
    return await userDao.register({
      ...user,
      password: createHash(password),
    });
  } catch (error) {
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const userExist = await userDao.getByEmail(email);
    if (!userExist) throw new Error("User not exist");
    const passValid = isValidPassword(password, userExist);
    if (!passValid) throw new Error("Password incorrect");
    return userExist;
  } catch (error) {
    throw error;
  }
};


export const getByEmail = async (email) => {
  try {
    return await userDao.getByEmail(email);
  } catch (error) {
    throw new Error(error);
  }
};

export const getById = async (id) => {
  try {
    const user = await userDao.getById(id);
    if (!user) throw new Error("User not exist");
    return user;
  } catch (error) {
    throw new Error(error);
  }
};
