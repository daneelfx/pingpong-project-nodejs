const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        minlength: 4,
        maxlength: 12
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate(email){
            if(!validator.isEmail(email)) throw new Error("Not a valid email address")
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 12,
        trim: true
    }
}, 
{
    timestamps: true
})


userSchema.pre("save", async function(next){
    const user = this
    if(user.isModified("password"))
        user.password = await bcrypt.hash(user.password, 8)
    next()    
})

const User = mongoose.model("User", userSchema)