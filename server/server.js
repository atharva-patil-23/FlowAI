import mongoose from "mongoose";
import express from "express";
import cors from "cors"
import helment from "helmet"
import morgan from "morgan"
import compression from "compression";
import rateLimit from "express-rate-limit"

import dotenv from "dotenv"

dotenv.config()

const app = express()

app.use(helment())

const limiter = rateLimit({
    windowMs : 15*60*1000,
    max:100
})

app.use('/api/',limiter)

app.use(express.json({limit:'10mb'}))
app.use(express.urlencoded({extended:true}))

if(process.env.NODE_ENV === "development"){
    app.use(morgan('dev'))
}

app.use(compression())

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB connected successfully"))
.catch((err) => console.log("MongoDB connection error",err))

app.get('/api/health' , (req,res) => {
    res.json({
        status:"OK",
        message:"FlowAi server is running",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    })
})

//Auth routes remaining 
app.use('/api/auth', authRoutes );
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

app.use((err,req, res , next) => {
    console.log(err.stack)
    res.status(500).json({
        message:'something went wrong!',
        error:process.env.NODE_ENV === 'development' ? err.message: {}
    })
})

app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });


const PORT = process.env.PORT || 5050

app.listen(process.env.PORT,() => {
    console.log(`Server is running on port ${PORT}`)
    console.log(`Environment ${process.env.NODE_ENV}`)
} )