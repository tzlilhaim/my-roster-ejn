const renderer = new Renderer()

const getRoster = function () {
  const $input = $("#team-name-input")
  if ($input.val().length) {
    $.get(`/teams/${$input.val()}`, function (data) {
      $input.val(null)
      if (data.teammates.length) {
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

$("#players-container").on("click", ".statistics-header>.go-back", function () {
  $player = $(this).closest(".player")
  renderer.renderFlipCardFront($player)
})

const openDreamTeamModal = function () {
  $.get(`/dreamTeam`, function (data) {
    renderer.renderDreamTeam(data)
  })
}

$("#dream-team-modal").on("click", "span.close", function () {
  renderer.closeDreamTeam()
})

$("#players-container").on("click", ".fa-star", function () {
  $player = $(this).closest(".player")
  const firstName = $player.attr("data-firstName")
  const lastName = $player.attr("data-lastName")

  let method = ""
  if ($player.hasClass("starred")) {
    method = "DELETE"
  } else {
    method = "POST"
  }

  $.ajax({
    url: `/roster`,
    type: method,
    data: { firstName: firstName, lastName: lastName },
    success: function (data) {

      if (data.isSuccess) {
        if (data["method"] === "delete") {
          $player.removeClass("starred")
        } else {
          $player.addClass("starred")
        }
      }
      renderer.renderPopupDreamTeam(data)
    },
  })
})

$("#dream-team-players").on("click",".remove-player-dt",function(){
  $dreamPlayer = $(this).closest(".player-dream-team")
  const firstName = $dreamPlayer.attr("data-firstName")
  const lastName = $dreamPlayer.attr("data-lastName")
  
  $.ajax({
    url: `/roster`,
    type: "DELETE",
    data: { firstName: firstName, lastName: lastName },
    success: function () {
      const $player = $(`.player[data-firstName='${firstName}']`)
      if(($player).length){
        $player.removeClass("starred")
      }
      openDreamTeamModal()
    }
  })
})

// Make search bar sticky on scroll
$(window).scroll(function () {
  let scroll = $(window).scrollTop()

  if (scroll > 100) {
    $("#search-bar").addClass("sticky")
  } else {
    $("#search-bar").removeClass("sticky")
  }
})

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  const $modal = $("#dream-team-modal")
  if ($(event.target).is($modal)) {
    renderer.closeDreamTeam()
  }
}
