import jwt from "jsonwebtoken"
import { User } from "../models/user.models"

const protect = async (req,res,next) => {
    try {
        let token;
        
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1]
        }

        if(!token){
            return res.status(401).json({
                success:false,
                message:'Not authorised to access this route'
            })
        }
        try {
            const decoded = jwt.verify(token,process.env.JWT_SECRET)

            const user = await User.findById(decoded.id)

            if(!user){
                return res.status(401).json({
                    success:false,
                    meassage:"no use found with this token"
                })
            }

            if(user.isLocked){
                return res.status(423).json({
                    success:false,
                    message:"the user account with this token is locked due to too many login attempts"
                })
            }

            req.user = user;
            next();

            
        } catch (error) {
            return res.status(401).json({
                success:false,
                message:'not a valid token'
            })
        }
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:"Server error in authentication"
        })
    }
}

const authorize = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            return res.status(401).json({
                success: false,
                message: `user role ${req.user.role} is not authorised to accesss this role` 
            })
        }
        next();
    }
}


const optionalAuth = async(req,res,next) => {
    try {

        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
          }
      
        if (token) {
            try {
              const decoded = jwt.verify(token, process.env.JWT_SECRET)

              const user = await User.findById(decoded.id)

              if (user && !user.isLocked) {
                req.user = user
              }
            }catch (error) {
               
            } 
        }   
        next();
    } catch (error) {
        next()
    }
}


export {protect , authorize , optionalAuth}