const request = require("request")
const teamToIDs = {
    lakers: "1610612747",
    warriors: "1610612744",
    heat: "1610612748",
    suns: "1610612756",
  }

  const data = {team:[]}

getTeam = function (year, teamName, res) {
  request(`http://data.nba.net/10s/prod/v1/${year}/players.json`, function (
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
      data.team = team
    res.send(data)
  })
}

module.exports = { get: getTeam }
