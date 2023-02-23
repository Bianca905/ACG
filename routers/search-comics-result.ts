import express from "express";
import type { Request, Response } from "express";
import { dbClient } from "../server";

export const searchComicsRecordsRoutes = express.Router();

searchComicsRecordsRoutes.get(
  "/searchResults/keyword/:keyword",
  getSearchResult
);

async function getSearchResult(req: Request, res: Response) {
  const searchParam = req.params.keyword;
  console.log("getSearchResultparams", searchParam);
  const result = await dbClient.query(
    /*SQL*/ `SELECT listings.name, listings.image, listings.price,meet_up_location FROM listings WHERE listings.is_Sold = false AND listings.is_Deleted = false AND LOWER(name) LIKE LOWER ($1) AND category = 'books' `,
    ["%" + searchParam + "%"]
  );
  console.log("testing from search-comics-results:", result.rows);
  res.json({ message: "success", data: result.rows });
}

searchComicsRecordsRoutes.get("/getComicsbycategory", getComicsbycategory);
console.log("checking from search-comics-results line 30");
async function getComicsbycategory(req: Request, res: Response) {
  const category = req.query.category;
  const queryResult = (
    await dbClient.query(
      "select * from listings where listings.is_Sold = false AND listings.is_Deleted = false AND category = $1",
      [category]
    )
  ).rows;
  res.status(200).json(queryResult);
}
