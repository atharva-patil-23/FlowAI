import express, { Router } from "express"
import { protect } from "../middleware/auth.js"


const taskRouter = Router()

taskRouter.get('/', protect, (req,res) => {
    res.json({message:'tasks route - coming soon'})
})

export default taskRouter