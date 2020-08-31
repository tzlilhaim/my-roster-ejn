class Renderer {
  constructor() {
    this.view = {
      $playersContainer: $("#players-container"),
      $playersTemplate: $("#player-template"),
    }
  }
  
  getTemplateHTML(data) {
    const source = this.view.$playersTemplate.html()
    const template = Handlebars.compile(source)
    const newHtml = template({ data })
    return newHtml
  }

  renderPlayers(players) {
    console.log(players)
    const newHTML = this.getTemplateHTML(players)
    console.log(newHTML)
    $("#players-container").append(newHTML)
  }
}