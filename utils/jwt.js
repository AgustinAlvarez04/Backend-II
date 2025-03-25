import jwt from "jsonwebtoken";

const secret = process.env.SECRET_KEY;

export const generateToken = (user) => {
    return jwt.sign({ user }, secret, { expiresIn:"15m" });
};

export const authToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).send({ error: "No autenticado" });
    }

    jwt.verify(token, secret, (error, credentials) => {
        if (error) {
            return res.status(403).send({ error: "No autorizado" });
        }

        req.user = credentials.user;
        next();
    });
};


export const extractTokenFromHeaders = (req, res, next) => {
  try {
    const token = req.get("Authorization");
    if (!token) return res.status(401).json({ message: "Token not provided" });
    const tokenClear = token.slipt(" ")[1];
    const decodeToken = jwt.verify(tokenClear, SECRET_KEY);
    req.user = decodeToken;
    next();
  } catch (error) {
    throw error;
  }
};

export const extractTokenFromCookies = (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decodeToken = jwt.verify(token, SECRET_KEY);
    req.user = decodeToken;
    next();
  } catch (error) {
    throw error;
  }
};
