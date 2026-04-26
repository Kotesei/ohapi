import "dotenv/config"
import express from "express";
import cors from "cors";

const app = express()
app.use(cors())
const port = 3000

app.get("/", (req, res) => {
    res.json({key: process.env.API_KEY})
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})