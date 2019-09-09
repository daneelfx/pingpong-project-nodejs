const express = require("express")
const app = express()
require("./db/mongoose")
const userRouter = require("./routers/user")
const tournamentRouter = require("./routers/tournament")

const port = process.env.PORT

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

app.use(express.json())
app.use(userRouter)
app.use(tournamentRouter)

app.listen(port, () => console.log("server is running at port " + port))