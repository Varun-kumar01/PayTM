const express = require('express');
const { userSignUpSchema, userSigninSchema, userUpdateSchema} = require('../zodSchemas/userSchema');
const userRouter = express.Router();
const {User, Account} = require("../db");
const jwt = require('jsonwebtoken');
const Jwt_Secret = require('../config');
const { userAuthenticator } = require('../middlewares/userAuth');
const bcrypt = require('bcrypt');


userRouter.post("/signup",async (req,res) => {
    const body = req.body;
    if(userSignUpSchema.safeParse(body).success){                          //zod verification
        if(await User.findOne({"userName": body.userName})){               //Check for same User
            res.status(411).json("Email already taken");
        }else{
            const saltRounds = 10;
            body.password = await bcrypt.hash(body.password, saltRounds);

            const newUser = await User.create({                            //User created in the database
                userName: body.userName,
                firstName: body.firstName,
                lastName: body.lastName,
                password: body.password,
            });

            const newUserId = newUser._id;

            await Account.create({                                         //Giving user a random balance in the accounts db
                userId: newUserId,
                balance: Math.floor(1+ (Math.random()*1000))
            })

            const token  = jwt.sign({                                      // JWT is assigned using the userId
                newUserId
            }, Jwt_Secret)
            res.status(200).json({
                msg: "User created",
                token: token
            });
        }       
    }else{
        res.status(411).json("wrong inputs");
    }
    return;
})


userRouter.post("/signin", async (req,res) => {
    const body = req.body;
    console.log(req.body);
    if(userSigninSchema.safeParse(body).success){
        if(!(await User.findOne({"userName": body.userName,
            // "password": body.password
        }))){               
            res.status(411).json("User not found please sign up");
        }else{
            res.status(200).json({
                msg:"you have all the access"
            })
        }
    }
    res.status(411).json({
        msg:"wrong inputs"
    })
})

userRouter.put("/update", userAuthenticator, async (req, res) => {
    const { success } = userUpdateSchema.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            msg: "invalid inputs to update"
        })
    }
    await User.updateOne({_id:req.userId}, req.body);

    return res.json({
        msg: "updated succesfully"
    })
    
})

userRouter.get("/bulk", async (req, res) => {
    const body = req.query.filter || "";

    if(!body){
        return res.status(411).json({
            msg:"wrong params"
        })
    }

    const allUsers = await User.find({
        firstName:{$regex: new RegExp(body, "i")}         // you can just use body instead of new RegExp(body, "i")
    });
    
    if(allUsers.length > 0){
        return res.status(200).json({
            users: allUsers.map(user => ({
                id: user._id,
                userName: user.UserName,
                firstName: user.firstName,
                lastName: user.lastName
            }))
        })
    }
        
    return res.json({
        msg: "User not found"
    })
})


module.exports = {
    userRouter
}