import express from "express";
import bcrypt from 'bcrypt';
import { client } from "../index.js";
import { getAlluser, genUserByEmail, createNewuser} from "../dbhelper.js";
import genhashPassword from "../genhashpassword.js";
import  jwt  from "jsonwebtoken";
import {auth} from "../middleware/auth.js";


const router= express.Router();


//Rest ---- display all users
router.get("/",async(req,res)=>{
    try {
        const users= await getAlluser();
        res.send(users);
    } catch (error) {
        res.status(400).send({"message":error});
    }
    
})

router.post("/register", express.json(), async(req,res)=>{
    try {
        console.log(req.body.email);
        const user = await genUserByEmail(req.body.email);
        console.log(user);
        if(user){
            res.status(400).send({"message":"Email already Register"});
        }
        else{
            try {

                const hashpass= await genhashPassword(req.body.password)
                const newuser={
                    "username": req.body.fname,
                    "email":req.body.email,
                    "password": hashpass,
                    "token":""
                }
                const result= await createNewuser(newuser);
                res.status(200).send(result);
                
            } catch (error) {
                res.status(200).send({"message":error});
            }
            
        }
        


    } catch (error) {
        res.status(400).send({"message":error});
    }
    
})


router.post("/login", auth, async(req,res)=>{
    try {
        console.log(req.body.email);
        const user = await genUserByEmail(req.body.email);
        console.log(user);
        if(user){
            const ispasswordmatch= await bcrypt.compare(req.body.password,user.password);
            console.log(ispasswordmatch);
            if(!ispasswordmatch)
            {
                res.status(400).send({"message":"Invalid Crendentials"});
            }
            else{
                const jwttoken=jwt.sign({id:user._id}, process.env.SECRET_KEY)



                res.status(200).send({"message":"successfull login", jwttoken:jwttoken});

            }

            
        }
        else{
            res.status(400).send({"message":"User not registered"});
        }
    } catch (error) {
        res.status(400).send({"message":error});
    }
})




export const userRouter=router;