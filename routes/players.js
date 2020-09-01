const getHeadshot = function (lastName, firstName) {
  return `https://nba-players.herokuapp.com/players/${lastName}/${firstName}`
}

const getStats = function(lastName, firstName){
    return `https://nba-players.herokuapp.com/players-stats/${lastName}/${firstName}`
}

module.exports = { getHeadshot, getStats }
