const express = require("express")
const app = express()
require("./db/mongoose")
const userRouter = require("./routers/user")

const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)

app.listen(port, () => console.log("server is running at port " + port))