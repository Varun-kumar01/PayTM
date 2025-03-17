const express = require('express');
const { Account } = require('../db');
const { userAuthenticator } = require('../middlewares/userAuth');
const accountRouter = express.Router();



accountRouter.post("/transfer",userAuthenticator,async (req,res) => {

        const { to, amount } = req.body;
    
        // Fetch sender's account
        const account = await Account.findOne({ userId: req.userId });
    
        if (!account || account.balance < amount) {
            return res.status(400).json({
                message: "Insufficient balance"
            });
        }
    
        // Fetch recipient's account
        const toAccount = await Account.findOne({ userId: to });
        if (!toAccount) {
            return res.status(400).json({
                message: "Invalid account"
            });
        }
    
        // Perform the transfer (without transactions)
        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } });
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } });
    
        res.json({ message: "Transfer successful" });

    
});


accountRouter.get("/balance",userAuthenticator,async (req,res) => {
    const currentUser = await Account.findOne({
        userId: req.body.id
    })
    res.json({
        message: `your account balance is ${currentUser.balance}`
    })
})


module.exports = {
    accountRouter
}

