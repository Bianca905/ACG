import express from "express";
import type { Request, Response } from "express";
import { dbClient } from "../server";
import { hashPassword } from "../hash";
export const registerRoutes = express.Router();

registerRoutes.get("/register", (req, res) => {
  console.log("registerRoutes");
});
registerRoutes.post("/register", register);

async function register(req: Request, res: Response) {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    res.status(400).json({ message: "missing username/password/ email" });
    return;
  }

  const queryResult = await dbClient.query(
    "SELECT id, username, password, email FROM users WHERE username = $1 or email = $2",
    [username, email]
  );
  const user = queryResult.rows[0];
  //console.log(queryResult)
  console.log("req.body: ", user);
  if (!user) {
    const hashedPassword = await hashPassword(password);
    const result = await dbClient.query(
      "INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id",
      [username, hashedPassword, email]
    );
    const newRegisterID = result.rows[0].id;
    req.session.user = { id: newRegisterID };
  } else {
    res.status(400).json({
      message:
        "Username/ email have already been used, please try another one!",
    });
    return;
  }

  res.json({ message: "success" });
}
