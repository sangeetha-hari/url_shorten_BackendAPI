import express from "express";
import { nanoid } from "nanoid";
import validUrl from "valid-url";

import { client } from "../index.js";
import {
  createNewUrl,
  getUrlByShortUrl,
  getAllUrl,
  getUrlBymonth,
} from "../dbhelper.js";

const router = express.Router();

//shorturl generator api
router.post("/",auth, async (req, res) => {
  try {
    const fullurl = req.body.fullurl;
    console.log(fullurl);
    if (validUrl.isUri(fullurl)) {
      console.log("Looks like an URI");
      const urlId = nanoid();
      console.log(urlId);
      // const shortUrl = process.env.BASE+'/'+urlId;
      const shortUrl = urlId;
      const date = Date();
      console.log(shortUrl);
      const newurl = {
        fullurl: req.body.fullurl,
        shorturl: shortUrl,
        date: date,
      };
      const result = await createNewUrl(newurl);
      console.log(result);
      const createdurl="https://url-shortern.onrender.com/"+shortUrl;
      res.status(200).send(createdurl);
    } else {
      console.log("Not a URI");
      res.send({ message: "Not a URI" });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// API for dashboard
router.get("/dashboard", async (req, res) => {
  try {
    console.log("This is dshboard API");
    const date = Date();
    console.log(date);
    const month = date.slice(4, 7);
    console.log(month);
    const urlOfMonth = await getUrlBymonth(month); console.log(urlOfMonth)
    res.status(200).send(urlOfMonth);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

//Rest ---- display all users
// To fetch using short url
router.get("/:code", async (req, res) => {
  try {
    console.log("this /:code");
    const urlcode = req.params.code;
    console.log(urlcode);
    const url = await getUrlByShortUrl(urlcode);
    console.log(url.fullurl);
    if (url) {
      return res.redirect(url.fullurl);
    } else {
      return res.status(404).json("No URL Found");
    }
  } catch (error) {
    res.status(500).json("Server Error");
  }
});

export const shortRouter = router;
