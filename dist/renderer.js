class Renderer {
  constructor() {
    this.view = {
      $shownTeamHeader: $("#shown-team"),
      $playersContainer: $("#players-container"),
      $playersTemplate: $("#player-template"),
      $statsTemplate: $("#stats-template"),
      $emptyStatsTemplate: $("#empty-stats-template"),
      $emptyTeamTemplate: $("#empty-team-template"),
    }
  }
  getTemplatedHTML($template, data) {
    const source = $template.html()
    const template = Handlebars.compile(source)
    const newHTML = template({ data })
    return newHTML
  }

  renderPlayers(players) {
    this.view.$playersContainer.empty()
    const newHTML = this.getTemplatedHTML(
      this.view.$playersTemplate,
      players.team
    )
    if (this.view.$playersContainer.hasClass("empty")) {
      this.view.$playersContainer.removeClass("empty")
    }
    this.view.$playersContainer.append(newHTML)

    this.view.$shownTeamHeader.text("The " + players.teamName + " team:")
  }
  renderAlertedInput() {
    const $input = $("#team-name-input")
    const $alertIcon = $("#search-bar>i")
    $input.addClass("alerted")
    $alertIcon.addClass("alerted")
    setTimeout(function () {
      $input.removeClass("alerted")
      $alertIcon.removeClass("alerted")
    }, 3000)
  }
  renderFlipCardBack($playerCard) {
    $playerCard.toggleClass("flipped")
  }
  renderFlipCardFront($playerCard) {
    $playerCard.toggleClass("flipped")
  }
  renderPlayerStats($player, stats) {
    $player.find(".flip-card-back").empty()
    if ($player.hasClass("empty")) {
      $player.removeClass("empty")
    }

    let newHTML = {}
    if (stats instanceof Object) {
      newHTML = this.getTemplatedHTML(this.view.$statsTemplate, stats)
    } else {
      newHTML = this.getTemplatedHTML(this.view.$emptyStatsTemplate, {})
      $player.find(".flip-card-back").addClass("empty")
    }
    
    $player.find(".flip-card-back").append(newHTML)
    this.renderFlipCardBack($player)
  }
  renderEmptyState(searchedName) {
    const empty = {
      title: "No players were found for team",
      teamName: searchedName,
      subTitle: "Please check your spelling or search for another team",
    }
    const newHTML = this.getTemplatedHTML(this.view.$emptyTeamTemplate, empty)
    this.view.$playersContainer.empty()
    this.view.$shownTeamHeader.text(null)
    this.view.$playersContainer.addClass("empty")
    this.view.$playersContainer.append(newHTML)
  }
}

// Make search bar sticky on scroll
$(window).scroll(function () {
  let scroll = $(window).scrollTop()

  if (scroll >= 100) {
    $("#search-bar").addClass("sticky")
  } else {
    $("#search-bar").removeClass("sticky")
  }
})