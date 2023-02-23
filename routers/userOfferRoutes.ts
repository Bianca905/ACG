import express from "express";
import { isLoggedInApi } from "../guards";
import { dbClient } from "../server";

export const userOfferRoutes = express.Router();

// GET offered listings data
userOfferRoutes.get("/received", isLoggedInApi, getOfferedListings);

// Get Made offer listings data
userOfferRoutes.get("/made", isLoggedInApi, getMadeOfferListings);

// Accept / Decline offer
userOfferRoutes.put(
  "/:offerId/:listingId",
  isLoggedInApi,
  respondOfferedListings
);

//  Sold transaction
userOfferRoutes.post("/:offerId/:listingId", isLoggedInApi, soldListings);
userOfferRoutes.put("/:offerId/:listingId/sold", isLoggedInApi, isSold);

async function getOfferedListings(req: express.Request, res: express.Response) {
  const userId = req.session["user"]?.id;

  const result = await dbClient.query(
    /*SQL*/ `
    SELECT users.username, offers.offer_price, offers.id, offers.is_accepted, offers.is_declined, listing_id, listings.name, listings.image, listings.is_brand_new, listings.price, listings.user_id, listings.is_reserved,listings.is_sold
    FROM offers
    JOIN users on users.id = offers.user_id
    JOIN listings on offers.listing_id = listings.id  
    WHERE listings.user_id = $1`,
    [userId]
  );

  res.json(result.rows);
}

async function respondOfferedListings(
  req: express.Request,
  res: express.Response
) {
  const offerId = parseInt(req.params.offerId);
  if (isNaN(offerId)) {
    res.status(400).json({ message: "id is not an integer" });
    return;
  }

  const listingId = parseInt(req.params.listingId);
  if (isNaN(listingId)) {
    res.status(400).json({ message: "id is not an integer" });
    return;
  }

  const acceptOffer = req.body.is_accepted;
  const declineOffer = req.body.is_declined;
  const reserveItem = req.body.is_reserved;

  // console.log("Accept: " ,acceptOffer, "Decline: ", declineOffer)
  // console.log("type of Accept: " , typeof acceptOffer, "type of Decline: ", typeof declineOffer)

  await dbClient.query(
    /*SQL*/ `UPDATE offers SET is_accepted = $1, is_declined = $2 WHERE id = $3`,
    [acceptOffer, declineOffer, offerId]
  );

  await dbClient.query(
    /*SQL*/ `UPDATE listings SET is_reserved = $1 WHERE id = $2`,
    [reserveItem, listingId]
  );

  console.log("accepted value: ", acceptOffer);
  console.log("declined value: ", declineOffer);
  console.log("reserved value: ", reserveItem);
  res.status(200).json({ success: true });
}

async function soldListings(req: express.Request, res: express.Response) {
  const offerId = parseInt(req.params.offerId);
  if (isNaN(offerId)) {
    res.status(400).json({ message: "id is not an integer" });
    return;
  }

  const listingId = parseInt(req.params.listingId);
  if (isNaN(listingId)) {
    res.status(400).json({ message: "id is not an integer" });
    return;
  }

  const userId = req.session["user"]?.id;

  await dbClient.query(
    /*SQL*/ `INSERT INTO transactions (offer_id, listing_id, user_id) VALUES ($1, $2, $3)`,
    [offerId, listingId, userId]
  );
  console.log("offer id: ", offerId);
  console.log("listing id: ", listingId);
  res.status(201).json({ success: true });
}

async function isSold(req: express.Request, res: express.Response) {
  const offerId = parseInt(req.params.offerId);
  if (isNaN(offerId)) {
    res.status(400).json({ message: "id is not an integer" });
    return;
  }

  const listingId = parseInt(req.params.listingId);
  if (isNaN(listingId)) {
    res.status(400).json({ message: "id is not an integer" });
    return;
  }

  const soldValue = req.body.is_sold;

  await dbClient.query(
    /*SQL*/ `UPDATE listings SET is_sold = $1 WHERE id = $2`,
    [soldValue, listingId]
  );
  console.log("sold value: ", soldValue);
  res.status(201).json({ success: true });
}

async function getMadeOfferListings(
  req: express.Request,
  res: express.Response
) {
  const userId = req.session["user"]?.id;

  const result = await dbClient.query(
    /*SQL*/ `
    SELECT users.username, offers.offer_price, offers.id, offers.is_accepted, offers.is_declined, listing_id, listings.name, listings.image, listings.user_id, listings.is_brand_new, listings.price, listings.is_reserved,listings.is_sold
    FROM offers  
    JOIN listings on offers.listing_id = listings.id  
    JOIN users on users.id = listings.user_id
    WHERE offers.user_id = $1`,
    [userId]
  );

  res.json(result.rows);
}
