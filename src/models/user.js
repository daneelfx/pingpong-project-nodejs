const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

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
        maxlength: 12,
        trim: true
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        validate(email){
            if(!validator.isEmail(email)) throw new Error("Invalid email")
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        trim: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, 
{
    timestamps: true
})

userSchema.virtual("tournaments", {
    ref: "Tournament",
    localField: "_id",
    foreignField: "creator"
})

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    // delete userObject.password
    // delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, "daneelfs")
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (username, password) => {
    const user = await User.findOne({username})
    if(!user) 
        throw new Error("Unable to login")
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch)
        throw new Error("Unable to login")
    return user
}

userSchema.pre("save", async function(next){
    const user = this
    if(user.isModified("password"))
        user.password = await bcrypt.hash(user.password, 8)
    next()    
})

const User = mongoose.model("User", userSchema)

module.exports = User