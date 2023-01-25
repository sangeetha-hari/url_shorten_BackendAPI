import express from "express";
import dotenv from 'dotenv';
import { MongoClient } from "mongodb";
import { userRouter } from "./routes/usersaccount.js";
import { getAlluser } from "./dbhelper.js";

dotenv.config();

const PORT=process.env.PORT;
const MONGO_URL=process.env.MONGO_URL;
const app=express();
app.use(express.json());

async function createConnection(){
    const client=new MongoClient(MONGO_URL);
    console.log("Mongo is connected");
    await client.connect();
    return client;
}

 export const client=await createConnection();

app.get("/",(req,res)=>{
    try {
        res.status(200).send("Welcome to app");
    } catch (error) {
        res.status(400).send({"message":error});
    }
   
})

app.get("/allusers",async(req,res)=>{
    try {
        const users= await getAlluser();
  res.send(users);
    } catch (error) {
        res.status(400).send({"message":error});
    }
   
})



app.use('/users',userRouter);

app.listen(PORT,()=>console.log("Server started on port",PORT));


