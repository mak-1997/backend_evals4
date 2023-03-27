const express = require("express");
const { PostModel } = require("../model/post.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const postRouter = express.Router();

// Read
postRouter.get("/", async (req, res) => {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, "mayank");
    const { min, max } = req.query;
    try {
        if (min && max) {
            const posts = PostModel.find({ comment: { $gte: min, $lte: max } });
            res.status(200).send(posts);
        }
        else {
            if (decoded) {
                const posts = PostModel.find({ "userID": decoded.userID });
                res.status(200).send(posts);
            }
        }
    } catch (error) {
        res.status(400).send({ "msg": error.message });
    }
})

// top
postRouter.get("/top", async (req, res) => {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, "mayank");
    try {

        if (decoded) {
            const posts = PostModel.find({ "userID": decoded.userID });
            res.status(200).send(posts);
        }

    } catch (error) {
        res.status(400).send({ "msg": error.message });
    }
})

// Single Post
postRouter.get("/:postID", async (req, res) => {
    const postID = req.params.postID;
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, "mayank");
    try {
        if (decoded) {
            const post = await PostModel.find({ _id: postID });
            res.status(200).send(post);
        }
    } catch (error) {
        res.status(400).send({ "msg": error.message });
    }
})

// Create
postRouter.post("/add", async (req, res) => {
    const payload = req.body;
    console.log(payload);
    try {
        const post = new PostModel(payload);
        await post.save();
        res.status(200).send(post);
    } catch (error) {
        res.status(400).send({ "msg": error.message });
    }
})

// Update
postRouter.patch("/update/postID", async (req, res) => {
    const payload = req.body;
    const id = req.params.postID;
    try {
        await PostModel.findByIdAndUpdate({ _id: id }, payload);
        res.status(200).send({ "msg": "Post has been updated" });
    } catch (error) {
        res.status(400).send({ "msg": error.message });
    }
})

// Delete
postRouter.patch("/update/postID", async (req, res) => {
    const id = req.params.postID;
    try {
        await PostModel.findByIdAndDelete({ _id: id });
        res.status(200).send({ "msg": "Post has been Deleted" });
    } catch (error) {
        res.status(400).send({ "msg": error.message });
    }
})


module.exports = { postRouter };