import express, { Router } from "express"
import { protect } from "../middleware/auth"


const router = Router()

router.get('/', protect, (req,res) => {
    res.json({message:'tasks route - coming soon'})
})

export default router