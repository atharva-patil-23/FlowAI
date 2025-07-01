import express, { Router } from "express"
import { protect } from "../middleware/auth.js"


const userRouter = Router()

userRouter.get('/', protect, (req,res) => {
    res.json({message:'Users route - coming soon'})
})

export default userRouter