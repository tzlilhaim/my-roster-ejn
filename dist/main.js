const renderer = new Renderer()

const getRoster = function () {
  const $input = $("#team-name-input")
  if ($input.val().length) {
    $.get(`/teams/${$input.val()}`, function (data) {
      $input.val(null)
      if (data.team.length) {
        renderer.renderPlayers(data)
      } else {
        renderer.renderEmptyState(data.teamName)
      }
    })
  } else {
    renderer.renderAlertedInput()
  }
}

$("#players-container").on("click", "button.showStats", function () {
  $player = $(this).closest(".player")
  const firstName = $player
    .attr("data-firstName")
    .replace(/[^a-zA-Z-+.^:,]+/g, "")
    .toLowerCase()
  const lastName = $player
    .attr("data-lastName")
    .replace(/[^a-zA-Z-+.^:,]+/g, "")
    .toLowerCase()
  const player = `${lastName}+${firstName}`

  $.get(`/playerStats/${player}`, function (stats) {
    renderer.renderPlayerStats($player, stats)
  })
})

$("#players-container").on("click", ".statistics-header>i", function () {
  $player = $(this).closest(".player")
  renderer.renderFlipCardFront($player)
})
