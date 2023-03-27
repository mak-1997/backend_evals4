const express = require("express");
require("dotenv").config();
const {connection} = require("./db");
const {userRouter} = require("./routes/user.route");
const {postRouter} = require("./routes/post.route");
const {auth} = require("./middleware/auth.middleware");
const cors = require("cors");


const app = express();

app.options("*",cors());
app.use(express.json());
app.use(cors({origin:"*"}));

app.use("/users", userRouter);
app.use(auth);
app.use("/posts", postRouter);

app.listen(process.env.port, async ()=>{
    try {
        await connection;
        console.log("Connected to database");
    } catch (error) {
        console.log("Cannot connect to the database");
        console.log(error.message);
    }
    console.log(`Server is running on port ${process.env.port}`);
})