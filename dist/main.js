const server = require('../server')

$("#search-bar>button").on("click",function(){
    const inputValue = $("#search-bar>input").val()
    fetch(`/teams/${inputValue}`)
})