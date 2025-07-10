import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import { createServer } from "http"
import { Server } from "socket.io"
import { json } from "stream/consumers"


const app = express()
const server = createServer(app)
const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:['GET','POST']
    }
});


app.use(cors());
app.use(express.json())

app.get('/' , (req,res) => {
    res.status(200).json({
        message:"AI task manager API"
    })
})

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})