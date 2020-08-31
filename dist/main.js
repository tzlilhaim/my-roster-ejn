const renderer = new Renderer()

getRoster = function() {
  const team = $('#team-name-input').val()
  $.get(`/teams/${team}`, function(data) {
      renderer.renderPlayers(data)
  })
}