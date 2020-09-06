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
    teams.getTeam(year,teamName,res)
  })

  router.get("/playerStats/:player", function (req, res) {
    const player = req.params.player.replace("+","/")
    players.getStats(player,res)
  })

  router.post("/team", function(req, res){
    const team = req.body
    teams.addTeam(team, res)
  })

  router.get("/dreamTeam", function (req, res) {
    teams.getDreamTeam(res)
  })

  router.post("/roster", function (req, res) {
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    teams.addToDreamTeam(firstName,lastName,res)
  })

  router.delete("/roster", function (req, res) {
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    teams.removeFromDreamTeam(firstName,lastName,res)
  })

module.exports = router