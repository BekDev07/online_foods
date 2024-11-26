import { NextFunction, Request, Response } from "express";
import { AuthPayload } from "../dto/Auth.dto";
import { ValidateSignature } from "../utility";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const Authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validateSignature = ValidateSignature(req);
  if (validateSignature) {
    next();
  } else {
    res.status(401).json({ message: "User not Authorized" });
  }
};
