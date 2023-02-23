import express from "express";
import type { Request, Response } from "express";
import { dbClient } from "../server";

export const searchOthersRecordsRoutes = express.Router();

searchOthersRecordsRoutes.get(
  "/searchOthersResults/keyword/:keyword",
  getSearchResult
);

searchOthersRecordsRoutes.get("/getOthersbycategory", getOthersbycategory);

async function getSearchResult(req: Request, res: Response) {
  const searchParam = req.params.keyword;
  console.log("getSearchResultparams - others - others", searchParam);
  const result = await dbClient.query(
    /*SQL*/ `SELECT listings.name, listings.image, listings.price,meet_up_location FROM listings WHERE listings.is_Sold = false AND listings.is_Deleted = false AND LOWER(name) LIKE LOWER ($1) AND category = 'others' `,
    ["%" + searchParam + "%"]
  );
  console.log("testing from search-others-results:", result.rows);
  res.json({ message: "success", data: result.rows });
}

async function getOthersbycategory(req: Request, res: Response) {
  console.log(`入到入唔到 from search-others-results line 30`);
  const category = req.query.category;
  const queryResult = (
    await dbClient.query(
      "select * from listings where listings.is_Sold = false AND listings.is_Deleted = false AND category = $1",
      [category]
    )
  ).rows;
  res.status(200).json(queryResult);
}
