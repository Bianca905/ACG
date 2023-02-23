//ATTENTION:run this ts separately every time after altering data before running server
import dotenv from "dotenv";
import pg from "pg";
import { hashPassword } from "./hash";

dotenv.config();

async function importData() {
  const client = new pg.Client({
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  });
  await client.connect();

  // DELETE FROM tables
  await client.query("DELETE FROM favourites");
  await client.query("DELETE FROM listings");
  await client.query("DELETE FROM users");

  // Insert dummy data
  const users = [
    { username: "abcd", password: "5678", email: "dforber0@hubpages.com" },
    { username: "qwer", password: "5678", email: "dforber0@hubpages.com" },
  ];

  for (const user of users) {
    const hashedPassword = await hashPassword(user.password);
    await client.query(
      "INSERT INTO users (username, password, email) VALUES ($1, $2, $3)",
      [user.username, hashedPassword, user.email]
    );
  }
  await client.end();
}

importData();
