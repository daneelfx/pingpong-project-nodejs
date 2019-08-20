const express = require ("express")
const router = express.Router()
const auth = require("../middleware/auth")
const User = require("../models/user")
const {sendWelcomeEmail, sendCancelationEmail} = require("../emails/account")
const multer = require("multer")
const sharp = require("sharp")

// Create User
router.post("/users", async (req, res) => {
    const user = new User(req.body)
    try{
        await user.save()
        //sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    }catch(error){
        res.status(400).send(error)
    }
})

// Login User
router.post("/users/login", async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.username, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    }catch(error){
        res.status(400).send()
    }
})

// Logout User
router.post("/users/logout", auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch(error){
        res.status(500).send()
    }
})

// Logout User (All)
router.post("/users/logoutAll", auth, async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(error){
        res.status(500).send()
    }
})

// Read User
router.get("/users/me", auth, async (req, res) => {
    res.send(req.user)
})


// Update User
router.patch("/users/me", auth, async (req, res) => {
    const allowedUpdates = ["name", "username", "email", "password"]
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation)
        return res.status(400).send({error: "invalid updates"})

    try{
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    }catch(error){
        res.status(400).send(error)
    } 
})

// Delete User
router.delete("/users/me", auth, async (req, res) => {
    try{
        await req.user.remove()
        //sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)
    }catch(error){
        res.status(500).send()
    }
})

const upload = multer({
    limits: {
        fileSize: 2000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
            return cb(new Error("upload a valid image format (jpg, jpeg or png)"))
        cb(undefined, true)

    }
})

// Upload Aavatar
router.post("/users/me/avatar", auth, upload.single("avatar"), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({
        width: 250,
        height: 250
    }).png().toBuffer()
    req.user.avatar = buffer
    await user.save()
    res.status(201).send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

// Delete Avatar
router.delete("/users/me/avatar", auth, async (req, res) => {
    req.user.avatar = undefined
    await user.save()
    res.send()
})

// Read Avatar
router.get("/users/me/avatar", auth, async (req, res) => {
    try{
        res.set("Content-Type", "image/png")
        res.send(req.user.avatar)
    } catch(error){
        res.status(404).send()
    }
})

module.exports = router