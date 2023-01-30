import { client } from "./index.js";

export async function getAlluser() {
    const result = await client.db("mentor_student").collection("url_shortendb").find().toArray();
    return result;
}

export async function genUserByEmail(name) {
    console.log("this is in getUserByEmail function");
    const result = await client.db("mentor_student").collection("url_shortendb").findOne({ email: name });
    return (result);
  }

  export async function createNewuser(newuser){
    console.log("this is insert function");
    console.log(newuser);
    const result= await client.db("mentor_student").collection("url_shortendb").insertOne(newuser);
    return result;
  }

  export async function userUpdateToken(name,randstring) {
    console.log("this is update function");
    const result= await client.db("mentor_student").collection("url_shortendb").updateOne({email:name},{$set:{token:randstring}});
    return (result);
  }

  export async function getUserByToken(token) {
    console.log("this is in getUserBytoken function");
    const result = await client.db("mentor_student").collection("url_shortendb").findOne({ token: token });
    return (result);
  }
  export async function userUpdateActive(name,act) {
    console.log("this is update function");
    const result= await client.db("mentor_student").collection("url_shortendb").updateOne({email:name},{$set:{active:act}});
    return (result);
  }

  export async function userUpdatePassword(name,hasedpass) {
    console.log("this is update function");
    const result= await client.db("mentor_student").collection("url_shortendb").updateOne({email:name},{$set:{password:hasedpass}});
    return (result);
  }

  

  export async function createNewUrl(newurl){
    console.log("this is insert url function");
    console.log(newurl);
    const result= await client.db("mentor_student").collection("url_short").insertOne(newurl);
    return result;
  }

  //findShortUrl
  export async function getUrlByShortUrl(shortUrl) {
    console.log("this is in getUrlByShortUrl function");
    const result = await client.db("mentor_student").collection("url_short").findOne({ shorturl: shortUrl });
    return (result);
  }

  export async function getAllUrl() {
    const result = await client.db("mentor_student").collection("url_short").find().toArray();
    return result;
}

export async function getUrlBymonth(month) {
  const result = await client.db("mentor_student").collection("url_short").find({date:{$regex : month}}).toArray();
  return result;
}
