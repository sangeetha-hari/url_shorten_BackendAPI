import express from "express";
import dotenv from 'dotenv';
import { MongoClient } from "mongodb";
import { userRouter } from "./routes/usersaccount.js";
import { getAlluser,createNewUrl, getUrlByShortUrl } from "./dbhelper.js";
import cors from 'cors';
import { nanoid } from "nanoid";
import validUrl from "valid-url";






dotenv.config();

const PORT=process.env.PORT;
const MONGO_URL=process.env.MONGO_URL;
export const app=express();
app.use(express.json());
app.use(cors());

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
//shorturl generator api
app.post("/shorturl", async (req, res) => {
try {
    const fullurl = req.body.fullurl;
    console.log(fullurl);
    if (validUrl.isUri(fullurl)) {
        console.log('Looks like an URI');
        const urlId = nanoid();
        console.log(urlId);
        // const shortUrl = process.env.BASE+'/'+urlId;
        const shortUrl=urlId;
        const date= Date();
        console.log(shortUrl);
        const newurl={ "fullurl":req.body.fullurl,
    "shorturl":shortUrl, "date":date};
    const result= await createNewUrl(newurl);
    console.log(result);
    res.status(200).send(result)
    } else {
        console.log('Not a URI');
        res.send({ message: "Not a URI" });
    }
    
} catch (error) {
    res.status(400).send({message:error.message})
}
});

// To fetch using short url
app.get("/:code",async(req,res)=>{
    try {
        const urlcode= req.params.code; console.log(urlcode);
    const url= await getUrlByShortUrl(urlcode); console.log(url.fullurl);
    if(url){
        return res.redirect(url.fullurl);
    }
    else{
        return res.status(404).json('No URL Found')
    }
    
    } catch (error) {
        res.status(500).json('Server Error')
    }

})


//for dashboard
app.get("/dashboard",async(req,res)=>{
    try {
        const date= Date(); 
        console.log(date);
        res.send("This is dashboard");

    } catch (error) {
        res.status(500).json('Server Error')
    }
})


app.use('/users',userRouter);


app.listen(PORT,()=>console.log("Server started on port",PORT));


