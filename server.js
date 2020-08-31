const express = require('express')
const path = require('path')
const app = express()
const api = require('./APIManager')

app.use(express.static(path.join(__dirname, 'dist')))
app.use('/scripts', express.static(__dirname + '/node_modules'))

const port = 3000
app.listen(port, function () {
    console.log(`Running server on port ${port}`)
})

app.get("/teams/:teamName", function (request, response) {
    const teamName = request.params.teamName.toLowerCase()
    const year = "2018"
    response.send(api.manager.fetchPlayersInTeam(year, teamName))
  })