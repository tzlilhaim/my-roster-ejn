const teams = require("./teams")
const players = require("./players")
const express = require("express")
const router = express.Router()

router.get("/health", function (req, res) {
    res.send("healthy")
  })

router.get("/teams/:teamName", function (req, res) {
    const teamName = String([req.params.teamName]).toLowerCase()
    const year = "2018"
    teams.get(year,teamName,res)
  })

  router.get("/playerStats/:player", function (req, res) {
    const player = req.params.player.replace("+","/")
    players.getStats(player,res)
  })

  router.post("/team", function(req, res){
    const team = req.body
    teams.post(team, res)
  })

module.exports = router