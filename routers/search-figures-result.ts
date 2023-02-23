import express from "express";
import type { Request, Response } from "express";
import { dbClient } from "../server";

export const searchRecordsRoutes = express.Router();
searchRecordsRoutes.get("/searchResults/keyword/:keyword", getSearchResult);

searchRecordsRoutes.get("/getproductbycategory", getProductByCategory);
// params

// searchRecordsRoutes.get('/getproductbycategory/:quantity', getProductByCategory)

// search bar routes

async function getSearchResult(req: Request, res: Response) {
  const searchParam = req.params.keyword;
  console.log("getSearchResultparams - figures", searchParam);
  const result = await dbClient.query(
    /*SQL*/ `SELECT listings.name, listings.image, listings.price,meet_up_location FROM listings WHERE listings.is_Sold = false AND listings.is_Deleted = false AND LOWER(name) LIKE LOWER ($1) AND category = 'figures' `,
    ["%" + searchParam + "%"]
  );
  // console.log('testing from search-figures-results:', result.rows);
  res.json({ message: "success", data: result.rows });
}

async function getProductByCategory(req: Request, res: Response) {
  const category = req.query.category;
  console.log("figures category: ");
  const queryResult = (
    await dbClient.query(
      "select * from listings where listings.is_Sold = false AND listings.is_Deleted = false AND category = $1",
      [category]
    )
  ).rows;

  // params
  // const quantity = req.params.quantity
  // console.log('quantity: ', quantity)
  // console.log('queryresult: ', queryResult)

  res.status(200).json(queryResult);
}
