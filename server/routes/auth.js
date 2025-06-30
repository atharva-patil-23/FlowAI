import express, { Router } from "express"
import {body , validationResult} from "express-validator"
import rateLimit from "express-rate-limit"
import { User } from "../models/user.models"
import { protect } from "../middleware/auth"

const router = Router()

const authLimiter = rateLimit({
    windowMs : 15 * 60 * 1000,
    max: 5,
    message : {
        success: false,
        message: "too many login attempts please try again after sometime"
    },
    statardHeaders:true,
    legacyHeaders:false
})


const registrationValidation = [
    body('name')
        .trim()
        .isLength({min:2 , max: 50})
        .withMessage('Name must be between 2 and 50 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({min : 6})
        .withMessage('Password must be at least 6 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain atleast one uppercase letter, one lowercase letter , and one number')
]

const loginValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('password is required')
]


router.post('/register',authLimiter,registrationValidation,async(req,res) => {
    try {
        
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                success : false,
                message: 'validation failed' , 
                errors : errors.array()
            })
        }

        const {name, email , password} = req.body;


        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exist with this email"
            })
        }

        const user = await User.create({
            name, 
            email,
            password
        })


        const token = user.generateToken();

        res.status(201).json({
            success:false,
            message:'User registred Successfully',
            token,
            user: {
                id :user._id,
                name:user.name,
                email: user.email,
                avatar:user.avatar,
                role:user.role,
                preferences: user.preferences 
            }
        })
    } catch (error) {
        console.error('Register error: ', error)
        res.status(500).json({
            success: false,
            message:'Server error during registratino'
        })
    }
})


router.post('/login',authLimiter,loginValidation , async(req,res) => {
    try {
        
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                success:false,
                message:"validation failed",
                errors:errors.array()
            });
        }
        

        const {email , password} = req.body;

        const user = await User.findOne({email}).select('+password');

        if(!user){
            return res.status(401).json({
                success:false,
                message:"invalid Credentials"
            })
        }

        if(user.isLocked) {
            return res.status(423).json({
                success:'Accout temporarily locked due to too many failed login attempt'
            })
        }

        const isMatch = await user.comparePassword(password);

        if(!isMatch){
            await user.incLoginAttempts();

            return res.status(401).json({
                success:false,
                message:'Invalid credentials'
            })
        }

        await user.resetLoginAttempst();

        const token = user.generateToken()

        res.json({
            success:true,
            message:'login Successful',
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                avatar:user.avatar,
                role:user.role,
                preferences:user.preferences,
                lastLogin:user.lastLogin
            }
        })

    } catch (error) {
        console.error('Login error: ', error);
        res.status(500).json({
            success:false,
            message:'server error during login'
        })
    }
})



router.get('/me', protect , async(req,res) => {
    try {
        
        const user = await User.findById(req.user.id);


        res.json({
            success:true,
            user
        });
    } catch (error) {
        console.error('Get user error:', error)
        res.status(500).json({
            success:false,
            message:'Server error getting user data'
        })
    }
})


router.get('/me', protect , async(req,res) => {
    try {
        
        const user = await User.findById(req.user.id);

        res.json({
            success:true,
            user
        })

    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success:false,
            message:'server error getting user data'
        })
    }
})

router.put('/profile',protect,[
    body('name')
        .optional()
        .trim()
        .isLength({min:2 , max:50})
        .withMessage('Name must be between 2 and 50 characters'),
    body('preferences.theme')
        .optional()
        .isIn(['light','dark','system'])
        .withMessage('Theme must be light, dark , or system'),
    body('preferences.notifications')
        .optional()
        .isBoolean()
        .withMessage('Notifications must be boolean')
], async(req,res) => {
    try {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({
                success:false,
                message: 'validation failed',
                errors: errors.array()
            })
        }

        const updates = {};

        const {name , preferences} = req.body;


        if(name) updates.name = name;
        if(preferences) updates.preferences = {...req.user.preferences, ...preferences};

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            {new:true , runValidators : true}
        );

        res.json({
            success:true,
            message:"Profile Updated Success",
            user
        })
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({
            success: false,
            message:'Server error updating profile'
        })
    }
})


router.post('/logout' , protect , (req,res) => {
    res.json({
        success: true,
        message: ' Logged out successfully'
    })
})


export default router;
