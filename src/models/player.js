const mongoose = require("mongoose")
const validator = require("validator")

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)) throw new Error("Invalid Email")
        }
    },
    phone: {
        type: String,
        required: true,
        maxlength: 10
    },
    score: {
        type: Number,
        default: 0
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    belongsTo: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Tournament"
    }
    }, {
        timestamps: true
    })

const Player = mongoose.model("players", playerSchema)

module.exports = Player