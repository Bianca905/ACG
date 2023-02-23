import express from "express";
import { isLoggedInApi } from "../guards";
import { dbClient } from "../server";

export const listingRecordRoutes = express.Router();

// Delete listing
listingRecordRoutes.put("/:listingId", isLoggedInApi, deleteListingByUser);

async function deleteListingByUser(
  req: express.Request,
  res: express.Response
) {
  const listingId = parseInt(req.params.listingId);
  if (isNaN(listingId)) {
    res.status(400).json({ message: "id is not an integer" });
    return;
  }

  const deleteValue = req.body.is_deleted;

  await dbClient.query(
    /*SQL*/ `UPDATE listings SET is_deleted = $1 WHERE id = $2`,
    [deleteValue, listingId]
  );
  res.status(200).json({ success: true });
}
