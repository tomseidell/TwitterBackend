import express from "express"
import userRoutes from "./routes/userRoutes.js"
import tweetRoutes from "./routes/tweetRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import { authenticateToken } from "./middlewares/authMiddleware.js"
import cors from "cors";

const app = express()

app.use(cors());
app.use(express.json())
app.use("/user", authenticateToken, userRoutes);
app.use("/tweet", authenticateToken, tweetRoutes)
app.use("/auth", authRoutes)


app.get("/", (req, res) =>{
    res.send("hello world new")
});




app.listen(3100, ()=>{
    console.log("server is running at localhost 3100")
})