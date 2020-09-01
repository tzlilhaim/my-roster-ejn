const renderer = new Renderer()

getRoster = function () {
  const $input = $("#team-name-input")
  if ($input.val().length) {
    $.get(`/teams/${$input.val()}`, function (data) {
      renderer.renderPlayers(data.team)
    })
  }else{
    renderer.renderAlertedInput()
  }
}