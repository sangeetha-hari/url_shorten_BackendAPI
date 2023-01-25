//custom middleware

import { response } from "express";
import jwt from "jsonwebtoken";

export const auth=(req,res,next)=>{

    try {
        const jwttoken=req.header("x-auth-token");
    console.log(jwttoken);
    //verify the token
    jwt.verify(jwttoken,process.env.SECRET_KEY)
    next();
    } catch (error) {
        res.status(400).send({"error":error.message})
    } 
}