const express = require("express")
const app = express()
require("./db/mongoose")
const userRouter = require("./routers/user")
const tournamentRouter = require("./routers/tournament")

const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(tournamentRouter)

app.listen(port, () => console.log("server is running at port " + port))