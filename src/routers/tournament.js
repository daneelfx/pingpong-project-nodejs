const express = require("express")
const router = express.Router()
const Tournament = require("../models/tournament")
const Player = require("../models/player")
const auth = require("../middleware/auth")

// Create Tournament
router.post("/tournaments", auth, async (req, res) => {
    const tournament = new Tournament({
        ...req.body,
        creator: req.user._id
    })

    try{
        await tournament.save()
        res.status(201).send(tournament)
    } catch(error){
        res.status(400).send(error)
    }
})

// Read Tournaments
router.get("/tournaments", auth, async (req, res) => {
    const match = {}
    const sort = {}

    if(req.query.played)
        match.played = req.query.played === "true"
    
    if(req.query.sortBy){
        const [createdAt, sortOrder] = req.query.sortBy.split(":")
        sort[createdAt] = sortOrder === "desc" ? -1 : 1
    }

    try{
        await req.user.populate({
            path: "tournaments",
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()

        if(req.user.tournaments.length === 0)
            return res.status(404).send({error: "There are no tournaments"})
        
        res.send(req.user.tournaments)
    } catch(error){
        res.status(500).send()
    }
})

// Create Player
router.post("/tournaments/:id/players", auth, async (req, res) => {
    const _id = req.params.id
    const player = new Player({
        ...req.body,
        creator: req.user._id,
        belongsTo: _id
    })
    //BUG WITH TOURNAMENT ID
    try{
        const existsTournament = await Tournament.exists({_id, creator: req.user._id})

        if(!existsTournament)
            return res.status(400).send()

        await player.save()
        res.status(201).send(player)
    } catch(error){
        res.status(400).send()
    }
})

// Read Players
router.get("/tournaments/:id/players", auth, async (req, res) => {
    const _id = req.params.id
    const sort = {}

    if(req.query.sortBy){
        const [score, sortOrder] = req.query.sortBy.split(":")
        sort[score] = sortOrder === "desc" ? -1 : 1
    }

    try{
        const tournament = await Tournament.findOne({_id, creator: req.user._id})

        if(!tournament)
            return res.status(400).send()

        await tournament.populate({
            path: "players",
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()

        res.send(tournament.players)
    } catch(error){
        res.status(500).send()
    }
})

// Delete Player
router.delete("/tournaments/:tournamentId/players/:playerId", auth, async (req, res) => {
    const _tournamentId = req.params.tournamentId
    const _playerId = req.params.playerId

    try{
        const player = await Player.findOneAndDelete({_id: _playerId, belongsTo: _tournamentId, creator: req.user._id})
        if(!player)
            return res.status(404).send({error: "player not found"})
        res.send(player)
    } catch(error){
        res.status(500).send()
    }
})

// Delete Players
router.delete("/tournaments/:id/players", auth, async (req, res) => {
    const _id = req.params.id
    try{
        const playersReport = await Player.deleteMany({belongsTo: _id, creator: req.user._id})

        res.send(playersReport)
    } catch(error){
        res.status(500).send()
    }
})

// Read Tournament
router.get("/tournaments/:id", auth, async (req, res) => {
    const _id = req.params.id

    try{
        const tournament = await Tournament.findOne({_id, creator: req.user._id})
        if(!tournament)
            return res.status(404).send({error: "tournament not found"})
        
        res.send(tournament)
    } catch(error){
        res.status(500).send()
    }
})

// Delete Tournament
router.delete("/tournaments/:id", auth, async (req, res) => {
    const _id = req.params.id

    try{
        const tournament = await Tournament.findOneAndDelete({_id, creator: req.user._id})
        if(!tournament)
            return res.status(404).send()
        res.send(tournament)
    } catch(error){
        res.status(500).send()
    }
})

module.exports = router