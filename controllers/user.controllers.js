import passport from "passport";
import User from "../daos/mongo/classes/user.dao.js";
import { generateToken } from "../utils/jwt.js";
import { usersService } from "../services/index.js";
import { createHash } from "../utils/bcrypt.js";
import * as services from "../services/user.services.js";



const userService = new User();

export const getUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json({ status: "success", payload: users });
  } catch (error) {
    return res.status(500).json({ status: "Error", error: error.message });
  }
};

export const getUserById = async (req, res) => {
  const { uid } = req.params;
  try {
    const user = await userService.getUserById(uid);
    res.status(200).json({ status: "success", payload: user });
  } catch (error) {
    return res.status(500).json({ status: "Error", error: error.message });
  }
};

export const createUser = async (req, res) => {
  const { email, password, first_name, last_name, role, age } = req.body;

  let key = createHash(password);

  try {
    const userFound = await usersService.getByEmail(email);
    if (userFound) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const newUser = await usersService.createUser({
      first_name,
      last_name,
      email,
      age,
      key,
      role,
    });
    const token = generateToken(newUser);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000,
    });

    return res.status(201).json({
      message: "Usuario creado exitosamente",
      token,
    });
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    return res.status(500).json({
      message: "Error al procesar la creación del usuario",
      error: error.message,
    });
  }
};

export const getCurrentUser = (req, res) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      console.log("Error de autenticación:", err);
      return res
        .status(500)
        .json({ message: "Error de autenticación", error: err });
    }

    if (!user) {
      console.log("Token no válido o vencido");
      return res.status(401).json({ message: "Token no válido o vencido" });
    }

    console.log("Usuario autenticado:", user);
    return res.status(200).json({ message: "Usuario autenticado", user });
  })(req, res);
};

export const loginUser = async (req, res, next) => {
  try {
    const user = await services.login(req.body);
    if (!user) res.json({ msg: "Invalid credentials" });
    const token = generateToken(user);
    res
      .cookie("token", token, { httpOnly: true })
      .json({ msg: "login ok", token });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  //Pagina para desloguearse
  req.session.destroy(); //Destruimos la session
  res.json({ message: "Sesion cerrada" }); //Retornamos un mensaje de exito
};