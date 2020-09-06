const renderer = new Renderer()
const localStorageManager = new LocalStorageManager()

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
    renderer.renderAlertedInput($input)
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
    if (data.length) {
      data.forEach((player) => {
        const nickname = localStorageManager.checkForExistingNickname(player.firstName,player.lastName)
        player["nickname"] = nickname
      })
    }
    renderer.renderDreamTeam(data)
  })
}

$("#dream-team-modal").on("click", "#dream-team-container>span.close", function () {
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

$("#dream-team-players").on("click", ".remove-player-dt", function () {
  const $dreamPlayer = $(this).closest(".player-dream-team")
  const firstName = $dreamPlayer.attr("data-firstName")
  const lastName = $dreamPlayer.attr("data-lastName")

  $.ajax({
    url: `/roster`,
    type: "DELETE",
    data: { firstName: firstName, lastName: lastName },
    success: function () {
      const $player = $(`.player[data-firstName='${firstName}']`)
      if ($player.length) {
        $player.removeClass("starred")
      }
      openDreamTeamModal()
    },
  })
})

$("#dream-team-players").on("click", ".give-dt-nickname>button", function () {
  const $input = $(this).closest(".give-dt-nickname").find("input")
  
  if ($input.val().length) {
    const $dreamPlayer = $(this).closest(".player-dream-team")
  const firstName = $dreamPlayer.attr("data-firstName")
  const lastName = $dreamPlayer.attr("data-lastName")
  localStorageManager.saveNewNickname(firstName,lastName,$input.val())
  
    $input.val(null)
    openDreamTeamModal()
  } else {
    renderer.renderAlertedInput($input)
  }
})

$("#dream-team-players").on("click", ".nickname>span.close", function () {
    const $dreamPlayer = $(this).closest(".player-dream-team")
    const firstName = $dreamPlayer.attr("data-firstName")
  const lastName = $dreamPlayer.attr("data-lastName")
    localStorageManager.deleteNickname(firstName,lastName, nicknames)
    openDreamTeamModal()
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