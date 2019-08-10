const mongoose = require("mongoose")

const tournamentSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true
    },
    place: {
        type: String,
        required: true,
        trim: true
    },
    played: {
        type: Boolean,
        default: false
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
},{
    timestamps: true
})

// tournamentSchema.virtual("players", {
//     ref: "Player",
//     localField: "_id",
//     foreignField: "belongsTo"
// })

const Tournament = mongoose.model("Tournament", tournamentSchema)

module.exports = Tournament