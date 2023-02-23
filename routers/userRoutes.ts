import { isLoggedInApi } from "./../guards";
import express from "express";
import type { Request, Response } from "express";
import { dbClient } from "../server";
import { checkPassword, hashPassword } from "../hash";
import fetch from "cross-fetch";
import { User } from "../model";
export const userRoutes = express.Router();

userRoutes.get("/login", (req, res) => res.redirect("/login.html"));
userRoutes.post("/login", login);

userRoutes.get("/login/google", loginGoogle);
userRoutes.get("/userInfo", isLoggedInApi, getSelfInfo);
userRoutes.get("/logout", logout);

// Logout Route
async function logout(req: express.Request, res: express.Response) {
  delete req.session["user"];
  res.redirect("/");
  console.log(`logged out`);
}

async function getSelfInfo(req: Request, res: Response) {
  const userId = req.session.user?.id as number;
  type Record = Omit<User, "password">;
  const queryResult = await dbClient.query<Record>(
    `SELECT id, username, email, profile_picture from users where id = $1`,
    [userId]
  );
  const user = queryResult.rows[0];
  res.json(user);
}

async function loginGoogle(req: express.Request, res: express.Response) {
  const accessToken = req.session?.["grant"].response.access_token;
  const fetchRes = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      method: "get",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const data = await fetchRes.json();
  console.log("google data:", data);
  const queryResult = await dbClient.query(
    /*SQL */ `SELECT * FROM users WHERE username = $1`,
    [data.email]
  );

  let user = queryResult.rows[0];
  if (!user) {
    const insertResult = await dbClient.query<User>(
      /*SQL */ `INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id, username, password, email`,
      [data.email, await hashPassword("dggefeffhfkk"), data.email]
    );

    user = insertResult.rows[0];
  }
  req.session.user = { id: user.id };
  console.log(user);

  res.redirect("/logined.html");
}

export async function login(req: Request, res: Response) {
  // try catch

  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: "missing username/password" });
    return;
  }

  const queryResult = await dbClient.query(
    "SELECT id, username, password FROM users WHERE username = $1",
    [username]
  );
  const user = queryResult.rows[0];

  if (!user || !(await checkPassword(password, user.password))) {
    res.status(400).json({ message: "invalid username/password" });
    return;
  }

  req.session.user = { id: user.id };
  res.json({ message: "success" });
}
