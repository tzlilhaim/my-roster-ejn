const request = require("request")
const player = require("./players")
const router = require(".")

const teamToIDs = {
  lakers: "1610612747",
  warriors: "1610612744",
  heat: "1610612748",
  suns: "1610612756",
}

const data = { teamName: "", team: [] }

const getTeam = function (year, teamName, res) {
  request(`http://data.nba.net/10s/prod/v1/${year}/players.json`, function (
    error,
    response,
    body
  ) {
    if (error) {
      next(error)
    } else {
      const players = JSON.parse(response.body).league.standard
      const team = players
        .filter((p) => p.teamId === teamToIDs[teamName] && p.isActive)
        .map((p) => {
          return {
            firstName: p.firstName,
            lastName: p.lastName,
            jersey: p.jersey,
            pos: p.pos,
            headshotUrl: player.getHeadshot(p.lastName, p.firstName),
          }
        })
      data.teamName = teamName
      data.team = team
      res.send(data)
    }
  })
}

const addTeam = function (team, res) {
  teamToIDs[team.teamName] = team.teamId
  res.send({ text: `Addded new team '${team.teamName}'`, teamToIDs: teamToIDs })
}

module.exports = { get: getTeam, post: addTeam }
