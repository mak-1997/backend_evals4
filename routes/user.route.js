const express = require("express");
const { UserModel } = require("../model/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userRouter = express.Router();

// register
userRouter.post("/register", async (req, res) => {
    const { email, name, gender, password, age, city, is_married } = req.body;

    try {
        const isReigistered = await UserModel.find({ email });
        if (isReigistered.length === 0) {
            bcrypt.hash(password, 4, (err, hash) => {
                const user = new UserModel({ email, name, gender, password: hash, age, city, is_married });
                user.save();
                res.status(200).send({ "msg": "User Registered Successfully !!" })
            })
        } else {
            res.send({ "msg": "User already exist, please login" });
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
})

// Login
userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    res.status(200).send({ "msg": "Login Successful !!", "token": jwt.sign({ "userID": user._id }, "mayank") });
                }
                else {
                    res.status(400).send({ "msg": "Wrong Password !!" });
                }
            })
        }
        else {
            res.status(400).send({ "msg": "User does not exist, please Register first." });
        }
    } catch (error) {

    }
})

module.exports = { userRouter };