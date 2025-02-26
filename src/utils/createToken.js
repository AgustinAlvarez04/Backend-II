import jwt from "jsonwebtoken";

export const createToken = (user) =>
  jwt.sign(user, "clave-secreta", { expiresIn: "24h" });
