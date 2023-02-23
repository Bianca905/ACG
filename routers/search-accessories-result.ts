import express from "express";
import type { Request, Response } from "express";
import { dbClient } from "../server";

export const searchAccessoriesRecordsRoutes = express.Router();

searchAccessoriesRecordsRoutes.get(
  "/searchAccResults/keyword/:keyword",
  getSearchResult
);

searchAccessoriesRecordsRoutes.get(
  "/getAccessoriesbycategory",
  getAccessoriesbycategory
);

async function getSearchResult(req: Request, res: Response) {
  const searchParam = req.params.keyword;
  console.log("getSearchResultparams", searchParam);
  const result = await dbClient.query(
    /*SQL*/ `SELECT listings.name, listings.image, listings.price,meet_up_location FROM listings WHERE listings.is_Sold = false AND listings.is_Deleted = false AND LOWER(name) LIKE LOWER ($1) AND category = 'accessories'`,
    ["%" + searchParam + "%"]
  );
  console.log("testing from search-accessories-results:", result.rows);
  res.json({ message: "success", data: result.rows });
}

async function getAccessoriesbycategory(req: Request, res: Response) {
  const category = req.query.category;
  const queryResult = (
    await dbClient.query(
      "select * from listings where listings.is_Sold = false AND listings.is_Deleted = false AND category = $1",
      [category]
    )
  ).rows;
  res.status(200).json(queryResult);
}

//SELECT listings.name, listings.image, listings.price,meet_up_location FROM listings WHERE listings.is_Sold = false AND listings.is_Deleted = false AND LOWER(name) LIKE LOWER ('%conan%') AND category = 'accessories';

//SELECT listings.name, listings.image, listings.price,meet_up_location FROM listings WHERE listings.is_Deleted = false OR listings.is_Sold = false;

//WHERE LOWER(name) LIKE LOWER ('%conan%') AND category = 'accessories'
