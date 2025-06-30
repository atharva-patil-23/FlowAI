import express from "express"
import {body , validationResult} from "express-validator"
import rateLimit from "express-rate-limit"
import { User } from "../models/user.models"
import { protect } from "../middleware/auth"

