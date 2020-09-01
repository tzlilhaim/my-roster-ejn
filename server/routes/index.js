const teams = require("./teams")
const express = require("express")
const router = express.Router()

router.get("/teams/:teamName", function (req, res) {
    const teamName = String([req.params.teamName]).toLowerCase()
    const year = "2018"
    teams.get(year,teamName,res)
  })

module.exports = router