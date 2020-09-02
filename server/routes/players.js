const request = require("request")

const getHeadshot = function (lastName, firstName) {
  return `https://nba-players.herokuapp.com/players/${lastName}/${firstName}`
}

const getStats = function (player, res) {
  request(
    `https://nba-players.herokuapp.com/players-stats/${player}`,
    function (error, response, body) {
      if (error) {
        next(error)
      } else {
        const stats = response.body
        res.send(stats)
      }
    }
  )
}

module.exports = { getHeadshot, getStats }
