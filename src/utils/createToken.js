import jwt from "jsonwebtoken";

export const createToken = (user) =>
  jwt.sign(user, "secret-key", { expiresIn: "24h" });
