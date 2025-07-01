import mongoose from "mongoose";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"name is required"],
        trim:true,
        maxlength:[50,"name connot contain more than 50 letters"]
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
        lowercase:true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
          ]
    },
    password:{
        type:String,
        required:[true,'password is required'],
        minlength:[true,'minimum 6 characters is complusory'],
        select:false
    },
    avatar:{
        type:String,
        default: function(){
            const initials = this.name.split(' ').map(n => n[0]).join(' ').toUpperCase();
            return `https://ui-avatars.com/api/?name=${initials}&background=random&size=200`
        }
    },
    role:{
        type:String,
        enum :['user','admin'],
        default:'user'
    },
    preferences:{
        theme:{
            type:String,
            enum:['light','dark','system'],
            default:'system'
        },
        notification:{
            type:Boolean,
            default:true
        },
        timezone:{
            type:String,
            default:'UTC'
        }
    },
    aisettings:{
        priorityweight:{
            type:Number,
            min:0,
            max:1,
            default:0.7
        },
        learningEnabled:{
            type:Boolean,
            default:true
        }
    },
    isEmailVerified:{
        type:Boolean,
        default:false
    },
    lastlogin:{
        type:Date
    },
    loginAttempts:{
        type:Number,
        default:0
    },
    lockUntil:{
        type:Date
    }
},{timetamps:true});

userSchema.index({email:1});
userSchema.index({createdAt:-1});

userSchema.virtual('isLocked').get(function() {
    return !!(this.lockUntil && this.lockUntil > Date.now())
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next;
    try {
        const salt = await bcryptjs.genSalt(12)
        this.password = await bcryptjs.hash(this.password,salt)
        next()
    } catch (error) {
        next (error)
    }
})

userSchema.methods.comparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword,this.password)
}

userSchema.methods.generateToken = function(){
    return jwt.sign(
        {
            id:this._id,
            email:this.email,
            role:this.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRY || '7d'
        }
    )
}

userSchema.methods.incLoginAttempts = function(){
    if(this.lockUntil && this.lockUntil < Date.now()){
        return this.updateOne({
            $unset:{lockUntil:1},
            $set:{loginAttempts:1}
        })
    }


    const updates = {$inc: {loginAttempts: 1}};

    if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; 
    }
    return this.updateOne(updates);
}

userSchema.methods.resetLoginAttempts = function(){
    return this.updateOne({
        $unset: {loginAttempts:1 , lockUntil :1},
        $set: {lastlogin: Date.now()}
    })
}

userSchema.methods.toJSON = function(){
    const user = this.toObject()
    delete user.password
    delete user.loginAttempts
    delete user.lockUntil
    return user
}


export const User = mongoose.model("User",userSchema)

