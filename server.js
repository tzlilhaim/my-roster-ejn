const express = require("express")
const path = require("path")
const app = express()
const api = require("./APIManager")

// Server setup
const port = 3000
app.listen(port, function () {
  console.log(`Running server on port ${port}`)
})

// Serving files
app.use(express.static(path.join(__dirname, "dist")))
app.use("/scripts", express.static(__dirname + "/node_modules"))

// Serving data
app.get("/teams/:teamName", function (request, response) {
  const teamName = request.params.teamName.toLowerCase()
  const year = "2018"
  api.manager.fetchPlayersInTeam(year, teamName, response)
})
