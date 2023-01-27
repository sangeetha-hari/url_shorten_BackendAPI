import express, { response } from "express";
import bcrypt from "bcrypt";
import { client } from "../index.js";
import {getAlluser,genUserByEmail,createNewuser,userUpdateToken, getUserByToken, userUpdateActive,userUpdatePassword} from "../dbhelper.js";
import genhashPassword from "../genhashpassword.js";
import jwt from "jsonwebtoken";
import { auth } from "../middleware/auth.js";
import Randomstring from "randomstring";
import nodemailer from "nodemailer";

const sendActivationMail=async(username,email,randomstring)=>{
  try {
console.log("this is send section");
const transpoter= nodemailer.createTransport({
  host:"smtp-mail.outlook.com",
  auth:{
    user:process.env.user,
    pass:process.env.pass,
  }
})

const mailOptions={
  from:process.env.user,
  to:email,
  subject:"To activate the account",
  html:'<p>Welcome'+username+'<br/> This mail is send so that you can activate your account. Do <a href="xyz?token='+randomstring+'">click here</a></p>',
}

transpoter.sendMail(mailOptions,function(error,info){
  if(error){
    console.log(error);
    // response.send(error);
    // return(error);
  }
  else{
    console.log("sending mail");
   
    // response.send(info);
    // return(info);
  }
})

  } catch (error) {
    response.status(400).send(error)
  }

}

const sendResetMail=async(username,email,randomstring)=>{
  try {
console.log("this is send section");
const transpoter= nodemailer.createTransport({
  host:"smtp-mail.outlook.com",
  auth:{
    user:process.env.user,
    pass:process.env.pass,
  }
})

const mailOptions={
  from:process.env.user,
  to:email,
  subject:"To activate the account",
  html:'<p>Welcome'+username+'<br/> This mail is for reset password your account. Do <a href="xyz">click here</a> your secret code is:'+randomstring+'</p>',
}

transpoter.sendMail(mailOptions,function(error,info){
  if(error){
    console.log(error);
    // response.send(error);
    // return(error);
  }
  else{
    console.log("sending mail");
   
    // response.send(info);
    // return(info);
  }
})

  } catch (error) {
    response.status(400).send(error)
  }

}

const router = express.Router();

//Rest ---- display all users
router.get("/", async (req, res) => {
  try {
    const users = await getAlluser();
    res.send(users);
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

// REST -End point ----------Register user
router.post("/register", async (req, res) => {
  try {
    console.log(req.body.email);
    const user = await genUserByEmail(req.body.email);
    console.log(user);
    if (user) {
      res.status(400).send({ message: "Email already Register" });
    } else {
      try {
        //Hash the password
        const hashpass = await genhashPassword(req.body.password);
        const newuser = {
          username: req.body.fname,
          email: req.body.email,
          password: hashpass,
          active: "no",
          token: "",
        };
        const result= await createNewuser(newuser);
        //Generate a random string
        const randstring = Randomstring.generate();
        console.log(randstring);
        const result1= await userUpdateToken(req.body.email,randstring);
        try {
          sendActivationMail(req.body.fname, req.body.email, randstring);
          // console.log("this is return from function:",sentOrNot);
          res.status(200).send({
            message:
              "Please check your mail and click the link to activate your account",
          });
        } catch (error) {
          res.status(400).send({ message: error });
        }
      } catch (error) {
        res.status(200).send({ message: error });
      }
    }
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

router.get("/activate",async(req,res)=>{
try {
  const token=req.query.token;
  const result= await getUserByToken(token);
  console.log("this is result of get",result);
  if(result){
    const activate="yes"
  const update= await userUpdateActive(result.email,activate);
  const update2= await userUpdateToken(result.email,"");
  console.log(update);

  res.status(200).send({"message":"Your Account is active now"});
  }
  else{
res.status(400).send({"message":"Invalid credentials"});
  }
} catch (error) {
  res.status(400).send({ "message": error.message });
}
})


router.post("/login", auth, async (req, res) => {
  try {
    console.log(req.body.email);
    const user = await genUserByEmail(req.body.email);
    console.log(user);
    if (user) {
      const ispasswordmatch = await bcrypt.compare(
        req.body.password,
        user.password
      );
      console.log(ispasswordmatch);
      if (!ispasswordmatch) {
        res.status(400).send({ message: "Invalid Crendentials" });
      } else {
        const jwttoken = jwt.sign({ id: user._id }, process.env.SECRET_KEY);

        res
          .status(200)
          .send({ message: "successfull login", jwttoken: jwttoken });
      }
    } else {
      res.status(400).send({ message: "User not registered" });
    }
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

//REST API for Forgot Password

router.post("/forgot_password", async (req, res) => {
  try {
    //Check for emailid in database
    console.log(req.body.email);
    const user = await genUserByEmail(req.body.email);
    console.log(user);
    if (user) {
      //generate a randome string to authenticate
      const randomstring=Randomstring.generate();
      console.log(randomstring);
      //update token in database
      const update2= await userUpdateToken(user.email,randomstring);
      console.log(update2);
      //send mail to email address
      sendResetMail(user.name,user.email, randomstring);
      res.status(200).send({message:"Please check your mail"});
    } else {
      res.status(400).send({ message: "Invalid Credential" });
    }
  } catch (error) {
    res.status(400).send({ message: error });
  }
});


router.post("/reset_password", async(req,res)=>{
try {
  //check the token
  const token=req.body.token;
  const newpassword=req.body.password;
  //get user by email
  const result= await genUserByEmail(req.body.email);
  //check the token match
  if(result.token==token){
console.log("token matched")
//hash the password
const hasedpass= await genhashPassword(req.body.password);
console.log(hasedpass);
const update= await userUpdatePassword(req.body.email,hasedpass); // now update the password
console.log("update is:",update);
res.status(200).send({message:"Password updated successfully"}); //send response
  }
  else{
    res.status(400).send({ message: "Invalid Crendentials" });
  }
} catch (error) {
  res.status(400).send({ message: error });
}
})

export const userRouter = router;
