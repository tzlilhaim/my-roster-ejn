const urllib = require("urllib")
const { error, Callbacks } = require("jquery")

class APIManager {
  constructor() {
    this.teamToIDs = {
      lakers: "1610612747",
      warriors: "1610612744",
      heat: "1610612748",
      suns: "1610612756",
    }
  }
  fetchPlayersInTeam(year, teamName, callback) {
    const am = this
    urllib.request(
      `http://data.nba.net/10s/prod/v1/${year}/players.json`,
      function (err, players) {
        if (err) {
          throw err
        }
        players = JSON.parse(players)
        const leagues = Object.keys(players.league)
        const activePlayersInTeam = []
        for (let leagueName of leagues) {
          const playersInLeague = players.league[leagueName].filter(
            (p) => p.teamId === am.teamToIDs[teamName] && p.isActive
          )
          activePlayersInTeam.push(...playersInLeague)
        }
        callback.send({players: activePlayersInTeam})
      }
    )
  }
}

const apiManager = new APIManager()
module.exports = { manager: apiManager }
