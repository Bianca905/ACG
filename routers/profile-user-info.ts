import express from "express";
import type { Request, Response } from "express";
import { form } from "../formidable";
import { dbClient } from "../server";
import { isLoggedInApi } from "../guards";

//---------------- profile info-------------//
export const profileRoutes = express.Router();
profileRoutes.put("/userInfo", isLoggedInApi, createUploadImage);
profileRoutes.put("/changePassword", isLoggedInApi, createUpdatePassword);

//-------------profile upload records------------//
profileRoutes.get("/userInfo/uploadRecords", isLoggedInApi, loadListingRecords);
//---------------profile favourites-----------------//
profileRoutes.get("/userInfo/favourites", isLoggedInApi, loadFavourites);

profileRoutes.get(
  "/userInfo/favoured/:listingId",
  isLoggedInApi,
  saveFavourite
);

//=================================================//
//=================================================//
async function loadFavourites(req: Request, res: Response) {
  const result = await dbClient.query(
    /*SQL*/ `SELECT 
    listings.id, listings.name, listings.image, listings.price, 
    listings.is_brand_new, listings.is_used, listings.user_id 
  from listings 
  INNER JOIN favourites ON listings.id = favourites.listing_id
  WHERE favourites.user_id = $1`,
    [req.session.user?.id]
  );

  res.json(result.rows);
}
//=================================================//
// select listings.id, listings.name, listings.image, listings.price from listings
// INNER JOIN favourites
// ON listings.id = favourites.listing_id
//=================================================//
async function saveFavourite(req: express.Request, res: express.Response) {
  const itemId = req.params.listingId;
  const userId = req.session.user?.id;
  console.log("/id/favourite from profile-user-info line 42", itemId, userId);

  const checkingQuery = (
    await dbClient.query(
      "select * from favourites where user_id = $1 and listing_id = $2 ",
      [userId, itemId]
    )
  ).rowCount;
  console.log("checking query from profile user info line 50:", checkingQuery);

  if (checkingQuery === 0) {
    const insertResult = await dbClient.query(
      "insert into favourites (listing_id, user_id) values ($1, $2) returning id",
      [itemId, userId]
    );
    if (insertResult.rowCount > 0) {
      res.status(200).json({ message: "success" });
    } else {
      res.status(400).json({ message: "insertion error" });
    }
  } else {
    await dbClient.query(
      "delete from favourites where listing_id = $1 and user_id = $2",
      [itemId, userId]
    );
  }
}

//--------------------------upload records---------------------------//
async function loadListingRecords(req: Request, res: Response) {
  const userId = req.session["user"]?.id;
  //console.log('/userInfo/uploadRecords - userId: ', userId)
  const result = await dbClient.query(
    /*SQL*/ `
      SELECT *
      FROM listings
      WHERE user_id = $1 AND listings.is_deleted != true`,
    [userId]
  );
  console.log("/userInfo/upload - result ", result);
  res.json(result.rows);
}

async function createUploadImage(req: Request, res: Response) {
  form.parse(req, async (err, _, files) => {
    if (err) {
      res.status(400).json({ message: "cannot upload file" });
      return;
    }
    const uploadImage = files["image"];
    const file_name = uploadImage["newFilename"];

    console.log("check req session data", req.session.user);

    if (uploadImage) {
      await dbClient.query(
        /*SQL*/ `UPDATE users SET profile_picture = $1 WHERE id = $2`,
        [file_name, req.session.user?.id]
      );
    }

    res.json({ message: "success" });
  });
}

async function createUpdatePassword(req: Request, res: Response) {
  const { newPassword } = req.body;
  console.log(newPassword);
  if (!newPassword) {
    res.status(400).json({ message: "missing password" });
    return;
  } else {
    await dbClient.query(
      /*SQL*/ `UPDATE users set password = $1 WHERE id = $2`,
      [newPassword, req.session.user?.id]
    );
  }

  res.json({ message: "success" });
}
