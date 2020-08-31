const express = require("express")
const app = express()
const request = require("request")
const path = require("path")
const { data } = require("jquery")
const port = 3000

const teamToIDs = {
  lakers: "1610612747",
  warriors: "1610612744",
  heat: "1610612748",
  suns: "1610612756",
}

app.use(express.static(path.join(__dirname, "dist")))
app.use("/scripts", express.static(__dirname + "/node_modules"))

app.get("/teams/:teamName", function (req, res) {
  const teamName = [req.params.teamName]
  request("http://data.nba.net/10s/prod/v1/2018/players.json", function (
    error,
    response,
    body
  ) {
    const players = JSON.parse(response.body).league.standard
    const team = players
      .filter((p) => p.teamId === teamToIDs[teamName] && p.isActive)
      .map((p) => {
        return {
          firstName: p.firstName,
          lastName: p.lastName,
          jersey: p.jersey,
          pos: p.pos,
        }
      })
    res.send(team)
  })
})

app.listen(port, function () {
  console.log(`running server on port ${port}`)
})