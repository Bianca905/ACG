import type { Request, Response, NextFunction } from "express";

declare module "express-session" {
  interface SessionData {
    user: { id: number };
  }
}

export const isLoggedInStatic = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.user) {
    res.redirect("/");
  } else {
    next();
  }
};

export const isLoggedInApi = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.user) {
    res.status(401).json({ message: "401 Unauthorized" });
  } else {
    next();
  }
};
