import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader); // Debug log

  if (!authHeader) {
    console.error("Missing Authorization Header");
    return res.status(401).json({ message: "Missing token1" });
  }

  let token;
  if (authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else {
    token = authHeader; // fallback if only token is sent
  }

  if (!token) {
    console.error("Token is undefined");
    return res.status(401).json({ message: "Missing token2" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("Token verification failed:", err.message); // Debug log
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    console.log("User authenticated:", user); // Debug log
    next();
  });
};
