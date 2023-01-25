import { client } from "./index.js";

export async function getAlluser() {
    const result = await client.db("mentor_student").collection("username_password").find().toArray();
    return result;
}

export async function genUserByEmail(name) {
    console.log("this is in getUserByEmail function");
    const result = await client.db("mentor_student").collection("username_password").findOne({ email: name });
    return (result);
  }

  export async function createNewuser(newuser){
    console.log("this is insert function");
    console.log(newuser);
    const result= await client.db("mentor_student").collection("username_password").insertOne(newuser);
    return result;
  }