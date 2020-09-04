const request = require("request")
const player = require("./players")

class Player {
  constructor(playerData) {
    ;(this.firstName = playerData.firstName),
      (this.lastName = playerData.lastName),
      (this.jersey = playerData.jersey),
      (this.headshotUrl = playerData.headshotUrl),
      (this.pos = playerData.pos),
      (this.isStarred = playerData.isStarred),
      (this.team = playerData.team)
  }
}

class Team {
  constructor(teamName) {
    ;(this.teamName = teamName), (this.players = [])
  }
  addPlayer(playerData) {
    const newPlayer = new Player(playerData)
    this.players.push(newPlayer)
  }
}

class DB {
  constructor() {
    ;(this.players = []), (this.teamToIDs = {}), (this.dreamTeam = [])
  }

  getTeamPlayers(teamName) {
    return this.players.filter((p) => p.team === teamName)
  }
  getTeamId(teamName) {
    return this.teamToIDs[teamName]
  }
  addTeamId(teamData) {
    this.teamToIDs[teamData.team] = teamData.teamId
  }
  storeTeam(team) {
    this.players.push(...team.players)
  }
  updateDreamTeam() {
    this.dreamTeam = db.players.filter((p) => p.isStarred)
  }
  getDreamTeamPlayers() {
    return this.dreamTeam
  }

  toggleStarred(firstName, lastName, isDreanPlayer) {
    this.players.find(
      (p) => p.firstName === firstName && p.lastName === lastName
    ).isStarred = isDreanPlayer
  }
  isInDreamTeam(firstName, lastName) {
    return this.dreamTeam.some(
      (p) => p.firstName === firstName && p.lastName === lastName
    )
  }
}

const db = new DB()
db.teamToIDs = {
  lakers: "1610612747",
  warriors: "1610612744",
  heat: "1610612748",
  suns: "1610612756",
}

const getTeam = function (year, teamName, res) {
  // Get already-stored data if exists, request from api otherwise
  const existingDataForTeam = db.getTeamPlayers(teamName)
  if (existingDataForTeam.length) {
    res.send({teamName: teamName, teammates:existingDataForTeam})
  } else {
    request(`http://data.nba.net/10s/prod/v1/${year}/players.json`, function (
      error,
      response,
      body
    ) {
      if (error) {
        next(error)
      } else {
        const players = JSON.parse(response.body).league.standard

        const team = new Team(teamName)
        players
          .filter((p) => p.teamId === db.teamToIDs[teamName] && p.isActive)
          .forEach((p) =>
            team.addPlayer({
              firstName: p.firstName,
              lastName: p.lastName,
              jersey: p.jersey,
              headshotUrl: player.getHeadshot(p.lastName, p.firstName),
              pos: p.pos,
              isStarred: db.isInDreamTeam(p.firstName, p.lastName),
              team: teamName,
            })
          )
        db.storeTeam(team)
        res.send({ teamName: teamName, teammates: db.getTeamPlayers(teamName) })
      }
    })
  }
}

const addTeam = function (team, res) {
  db.addTeamId(team)
  res.send({ text: `Addded new team '${team.teamName}'`, teamToIDs: teamToIDs })
}

const getDreamTeam = function (res) {
  res.send(db.getDreamTeamPlayers())
}

const addToDreamTeam = function (firstName, lastName, res) {
  let message = {}
  if (db.isInDreamTeam(firstName, lastName)) {
    message = {
      title: "This player is already in the dream team!",
      subTitle: "Pick someone else",
      isSuccess: false,
    }
  } else {
    if (db.dreamTeam.length < 5) {
      db.toggleStarred(firstName, lastName, true)
      db.updateDreamTeam()

      message = {
        title: `Addded '${firstName} ${lastName} to the dream team!'`,
        dreamTeam: db.getDreamTeamPlayers(),
        method: "post",
        isSuccess: true,
      }
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
  db.toggleStarred(firstName, lastName, false)
  db.updateDreamTeam()

  res.send({
    title: `Removed '${firstName} ${lastName} from the dream team!'`,
    dreamTeam: db.getDreamTeamPlayers(),
    method: "delete",
    isSuccess: true,
  })
}

module.exports = {
  getTeam,
  addTeam,
  getDreamTeam,
  addToDreamTeam,
  removeFromDreamTeam,
}
