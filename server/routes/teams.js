const request = require("request")
const player = require("./players")

const teamToIDs = {
  lakers: "1610612747",
  warriors: "1610612744",
  heat: "1610612748",
  suns: "1610612756",
}

const db = {
  dreamTeam: [],
  data: { teamName: "", team: [] },
}

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
            isStarred: false,
          }
        })
      db.data.teamName = teamName
      db.data.team = team
      res.send(db.data)
    }
  })
}

const addTeam = function (team, res) {
  teamToIDs[team.teamName] = team.teamId
  res.send({ text: `Addded new team '${team.teamName}'`, teamToIDs: teamToIDs })
}

const getDreamTeam = function (res) {
  res.send(db.dreamTeam)
}

const addToDreamTeam = function (firstName, lastName, res) {
  let message = {}
  if (
    db.dreamTeam.some(
      (p) => p.firstName === firstName && p.lastName === lastName
    )
  ) {
    message = {
      title: "This player is already in the dream team!",
      subTitle: "Pick someone else",
      isSuccess: false}
  } else {
    if (db.dreamTeam.length < 5) {
      db.data.team.find(
        (p) => p.firstName === firstName && p.lastName === lastName
      ).isStarred = true
      db.dreamTeam.push(
        db.data.team.find(
          (p) => p.firstName === firstName && p.lastName === lastName))
      message = {
        title: `Addded '${firstName} ${lastName} to the dream team!'`,
        dreamTeam: db.dreamTeam,
        method: "post",
        isSuccess: true}
    } else {
      message = {
        title: "The dream team is full!",
        subTitle:
          "You must remove a player to add this one, having up to 5 players",
        isSuccess: false,
      }
    }
  }
  res.send(message)
}

const removeFromDreamTeam = function (firstName, lastName, res) {
  db.data.team.find(
    (p) => p.firstName === firstName && p.lastName === lastName
  ).isStarred = false
  const playerIndex = db.dreamTeam.map((i) => {
    return db.dreamTeam.indexOf(
      db.dreamTeam.find(
        (p) => p.firstName === firstName && p.lastName === lastName
      )
    )
  })
  db.dreamTeam.splice(playerIndex, 1)
  res.send({
    title: `Removed '${firstName} ${lastName} from the dream team!'`,
    dreamTeam: db.dreamTeam,
    method: "delete",
    isSuccess:true
  })
}

module.exports = {
  getTeam: getTeam,
  addTeam: addTeam,
  getDreamTeam: getDreamTeam,
  addToDreamTeam: addToDreamTeam,
  removeFromDreamTeam: removeFromDreamTeam,
}
