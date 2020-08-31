const express = require("express")
const app = express()
const path = require("path")
const port = 3000
const routes = require("./routes/index")

app.use(express.static(path.join(__dirname, "dist")))
app.use("/scripts", express.static(__dirname + "/node_modules"))

app.get("/teams/:teamName", function (req, res) {
  const teamName = [req.params.teamName]
  const year = "2018"
  routes.teams.get(year,teamName,res)
})

app.listen(port, function () {
  console.log(`running server on port ${port}`)
})
