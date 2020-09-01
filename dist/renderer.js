class Renderer {
  constructor() {
    this.view = {
      $playersContainer: $("#players-container"),
      $playersTemplate: $("#player-template"),
    }
    this.data = {}
  }

  renderPlayers(players) {
    const source = this.view.$playersTemplate.html()
    const template = Handlebars.compile(source)
    const newHTML = template({ players })
    this.view.$playersContainer.append(newHTML)
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
}

// Make search bar sticky on scroll
$(window).scroll(function() {    
  let scroll = $(window).scrollTop();

  if (scroll >= 100) {
      $("#search-bar").addClass("sticky");
  } else {
      $("#search-bar").removeClass("sticky");
  }
})
