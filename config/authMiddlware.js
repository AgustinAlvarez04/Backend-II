
export const authorizeRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};
export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Administrators Room" });
  }
  next();
};
export const authorizeUser = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "Users Room" });
  }
  next();
};
