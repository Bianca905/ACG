import express from "express";
import { isLoggedInApi } from "../guards";
import { dbClient } from "../server";

export const messageRoutes = express.Router();

//Get all message list
messageRoutes.get("/", isLoggedInApi, getMessagesList);

// GET detailed message
messageRoutes.get("/:from_userId", isLoggedInApi, getMessagesContent);

// Send Message to seller
messageRoutes.post("/:to_userId/:listingId", isLoggedInApi, sendMessage);

// Reply message to buyer
messageRoutes.post("/:to_userId", isLoggedInApi, replyMessage);

async function sendMessage(req: express.Request, res: express.Response) {
  const to_userId = parseInt(req.params.to_userId);
  if (isNaN(to_userId)) {
    res.status(400).json({ message: "id is not an integer" });
    return;
  }

  const listingId = parseInt(req.params.listingId);
  if (isNaN(listingId)) {
    res.status(400).json({ message: "id is not an integer" });
    return;
  }

  const messageContent = req.body.content;
  const from_userId = req.session["user"]?.id;

  await dbClient.query(
    /*SQL*/ `INSERT INTO messages (content, to_user_id, from_user_id, listing_id) VALUES ($1, $2, $3, $4)`,
    [messageContent, to_userId, from_userId, listingId]
  );
  console.log("Content: ", messageContent);

  console.log("listing id: ", listingId);

  console.log("to user id: ", to_userId);

  console.log("from user id: ", from_userId);

  res.status(201).json({ success: true });
}

async function getMessagesContent(req: express.Request, res: express.Response) {
  const from_userId = parseInt(req.params.from_userId);
  if (isNaN(from_userId)) {
    res.status(400).json({ message: "id is not an integer" });
    return;
  }

  const userId = req.session["user"]?.id;

  const result = await dbClient.query(
    /*SQL*/ `SELECT messages.content, messages.to_user_id,
    messages.from_user_id, users.username, users.profile_picture, messages.id, messages.listing_id, messages.created_at
	FROM messages 
    JOIN users ON users.id = messages.from_user_id WHERE messages.to_user_id = ($1) AND messages.from_user_id = ($2)`,
    [userId, from_userId]
  );

  res.json(result.rows);
}

async function replyMessage(req: express.Request, res: express.Response) {
  const to_userId = parseInt(req.params.to_userId);
  if (isNaN(to_userId)) {
    res.status(400).json({ message: "id is not an integer" });
    return;
  }

  const messageContent = req.body.content;
  const from_userId = req.session["user"]?.id;

  await dbClient.query(
    /*SQL*/ `INSERT INTO messages (content, to_user_id, from_user_id) VALUES ($1, $2, $3)`,
    [messageContent, to_userId, from_userId]
  );

  res.status(201).json({ success: true });
}

async function getMessagesList(req: express.Request, res: express.Response) {
  const userId = req.session["user"]?.id;

  const result = await dbClient.query(
    /*SQL*/ `SELECT messages.content, messages.to_user_id,
    messages.from_user_id, users.username, users.profile_picture, messages.id, messages.listing_id, messages.created_at
	FROM messages 
    JOIN users ON users.id = messages.from_user_id WHERE messages.to_user_id = ($1)`,
    [userId]
  );

  res.json(result.rows);
}
