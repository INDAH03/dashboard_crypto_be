// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";

// export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
//   const token = req.headers["authorization"]?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "Token tidak ada" });

//   jwt.verify(token, process.env.JWT_SECRET || "secret", (err, decoded) => {
//     if (err) return res.status(403).json({ message: "Token tidak valid" });
//     (req as any).user = decoded;
//     next();
//   });
// };

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token tidak ada" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token tidak valid" });
  }
};
