import express from "express";
import expressSession from "express-session";
import path from "path";
import grant from "grant";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
export const dbClient = new pg.Client({
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
});
dbClient.connect();
const PORT = 8080;

const grantExpress = grant.express({
  defaults: {
    origin: `http://localhost:${PORT}`,
    transport: "session",
    state: true,
  },
  google: {
    key: process.env.GOOGLE_CLIENT_ID || "",
    secret: process.env.GOOGLE_CLIENT_SECRET || "",
    scope: ["profile", "email"],
    callback: "/login/google",
  },
});
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  expressSession({
    secret: Math.random().toString(32).slice(2),
    resave: true,
    saveUninitialized: true,
  })
);
app.use(grantExpress as express.RequestHandler);
//Section 1 (Middleware for all routes)
// Section 2 (Routers)
import { isLoggedInStatic } from "./guards";
import { userRoutes } from "./routers/userRoutes";
import { profileRoutes } from "./routers/profile-user-info";
import { registerRoutes } from "./routers/registerRoutes";
import { listingRoutes } from "./routers/listingRoutes";
import { userOfferRoutes } from "./routers/userOfferRoutes";
import { searchRecordsRoutes } from "./routers/search-figures-result";
import { listingRecordRoutes } from "./routers/listingRecordsByUser";
import { searchAccessoriesRecordsRoutes } from "./routers/search-accessories-result";
import { messageRoutes } from "./routers/messageRoutes";
import { searchComicsRecordsRoutes } from "./routers/search-comics-result";
import { searchOthersRecordsRoutes } from "./routers/search-others-result";

app.use(userRoutes);
app.use(profileRoutes);
app.use(registerRoutes);

app.use("/listings", listingRoutes);
app.use("/userInfo/uploadRecords", listingRecordRoutes);
app.use(searchRecordsRoutes);
app.use(searchComicsRecordsRoutes);
app.use(searchAccessoriesRecordsRoutes);

app.use("/user/listings/offers", userOfferRoutes);

app.use("/messages", messageRoutes);
app.use(searchOthersRecordsRoutes);

// Section 3 (serve files)
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));

app.use(isLoggedInStatic, express.static(path.join(__dirname, "private")));
app.use((req, res) => {
  res.sendFile(path.resolve("./public/404.html"));
});

app.listen(PORT, () => {
  console.log(`Listening to http://localhost:${PORT})`);
});
