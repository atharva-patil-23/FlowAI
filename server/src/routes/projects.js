import express, { Router } from "express"
import { protect } from "../middleware/auth.js"


const projectRouter = Router()

projectRouter.get('/', protect, (req,res) => {
    res.json({message:'projects route - coming soon'})
})

export default projectRouter