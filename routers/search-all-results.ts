import express from "express";
import type { Request, Response } from "express";
import { dbClient } from "../server";

export const searchAllRecordsRoutes = express.Router();

searchAllRecordsRoutes.get(
  "/searchAllResults/keyword/:keyword",
  getSearchResult
);

//searchAllRecordsRoutes.get("/getAllByCategory", getAllByCategory);

async function getSearchResult(req: Request, res: Response) {
  //const searchParam = req.params.keyword;

  const result = await dbClient.query(
    /*SQL*/ `SELECT listings.name, listings.image, listings.price,meet_up_location FROM listings WHERE listings.is_Sold = false AND listings.is_Deleted = false AND LOWER(name) LIKE LOWER '%Conan%' AND category = 'figures' OR  category = 'books' or category = 'accessories' or category = 'others'`
  );
  //console.log('testing from search-all-results:', result);
  console.log(
    `SELECT listings.name, listings.image, listings.price,meet_up_location FROM listings WHERE listings.is_Sold = false AND listings.is_Deleted = false AND LOWER(name) LIKE LOWER '%Conan%' AND category = 'figures' OR  category = 'books' or category = 'accessories' or category = 'others'`
  );
  res.json({ message: "success", data: result.rows });
}
//   async function getAllByCategory(req:Request, res:Response) {
//     const category = req.query.category;
//     const queryResult = (
//       await dbClient.query("select * from listings where listings.is_Sold = false AND listings.is_Deleted = false AND category = $1",[
//         category
//       ])
//     ).rows;
//     res.status(200).json(queryResult);
//   }

// /*SQL*/ `SELECT listings.name, listings.image, listings.price,meet_up_location FROM listings WHERE listings.is_Sold = false AND listings.is_Deleted = false AND LOWER(name) LIKE LOWER ($1) AND category = 'figures' OR  category = 'books' or category = 'accessories' or category = 'others'`, ['%'+searchParam+'%']
