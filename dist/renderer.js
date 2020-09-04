class Renderer {
  constructor() {
    this.view = {
      $shownTeamHeader: $("#shown-team"),
      $playersContainer: $("#players-container"),
      $playersTemplate: $("#player-template"),
      $statsTemplate: $("#stats-template"),
      $emptyStatsTemplate: $("#empty-stats-template"),
      $emptyTeamTemplate: $("#empty-team-template"),
      $dreamTeamTeamplate: $("#dream-team-template"),
      $dreamTeamModal: $("#dream-team-modal"),
      $dreamTeamEmptyTemplate: $("#dream-team-empty-template"),
      $dreamTeamContainer: $("#dream-team-players"),
      $successDreamTeamTemplate: $("#success-dream-team-template"),
      $failureDreamTeamTemplate: $("#failure-dream-team-template"),
      $popupDreamTeamModal: $("#popup-modal"),
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
      players.teammates
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
  renderDreamTeam(dreamTeam) {
    this.view.$dreamTeamContainer.empty()
    let newHTML = {}
    if (dreamTeam.length) {
      if (this.view.$dreamTeamModal.hasClass("empty")) {
        this.view.$dreamTeamModal.removeClass("empty")
      }
      newHTML = this.getTemplatedHTML(this.view.$dreamTeamTeamplate, dreamTeam)
    } else {
      const empty = {
        title: "The dream team is still empty",
        subTitle: "Please add up to 5 players",
      }
      this.view.$dreamTeamModal.addClass("empty")
      newHTML = this.getTemplatedHTML(this.view.$dreamTeamEmptyTemplate, empty)
    }
    this.view.$dreamTeamModal.css("display", "block")
    this.view.$dreamTeamContainer.append(newHTML)
  }
  closeDreamTeam() {
    this.view.$dreamTeamModal.css("display", "none")
  }
  renderPopupDreamTeam(data) {
    this.view.$popupDreamTeamModal.empty()
    let newHTML ={}
    if(data.isSuccess){
      newHTML = this.getTemplatedHTML(this.view.$successDreamTeamTemplate,data)
    }else{
      newHTML = this.getTemplatedHTML(this.view.$failureDreamTeamTemplate,data)
    }

    this.view.$popupDreamTeamModal.append(newHTML)
    const $modal = this.view.$popupDreamTeamModal.closest(".modal")
    $modal.css("display", "block")
    setTimeout(function () {
      $modal.css("display", "none")
    }, 2500)
  }
}
