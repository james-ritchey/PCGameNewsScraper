var articles;
// Grab the articles as a json
$.getJSON("/articles", function(data) {
    articles = data;
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#article-list").append("<div class='article'><div class='article-img'><img src='" + data[i].img + 
      "' width='240px'></div><div class='article-text' data-id='" + data[i]._id + "'><p data-link='" + data[i].link + "'><span class='article-title'>" + 
      data[i].title + ".</span><br />" + data[i].synopsis + "</p></div></div><hr>");
    }
});

$(document).on("click", ".article", function() {
    var activeArticle = $(this).find("div.article-text").attr("data-id");
    $("#comment-section").css("display", "block");
    $("#active-article").css("display", "block");
    //$("#active-article").append(this);
    articles.forEach(function(item) {
        if(item._id === activeArticle){
            $("#active-article").append("<div><div class='active-article-img'><img src='" + item.img + 
            "' width='240px'></div><div class='active-article-text'><p data-id='" + item._id + "' data-link='" + item.link + "'><a href='" + item.link + "'><span class='active-article-title'>" + 
            item.title + ".</span></a><br />" + item.synopsis + "</p></div></div><hr>");
            $("#active-article").attr("data-id", item._id);
        }
    });
    console.log(activeArticle);
    $.ajax({
        method: "GET",
        url: "/articles/" + activeArticle
      })
        // With that done, add the note information to the page
        .then(function(data) {
          console.log(data.notes);
          data.notes.forEach(function(item) {
            $("#comment-list").append($("<div class='comment'><p class='comment-user'>" + item.user + "</p><p class='comment-text'>" + item.body + "</p></div>"))
          })
        });

    $("#article-list").css("display", "none");

});

$(document).on("click", "#submit", function() {
  if(!localStorage.getItem("user")){
    var user = prompt("Please enter a username");
    localStorage.setItem("user", user);
  }
  if($("#comment-input").val() !== "") {
      var articleId = $("#active-article").attr("data-id");
      console.log(articleId);
      $.ajax({
          method: "POST",
          url: "/articles/" + articleId,
          data: {
            // Value taken from note textarea
            body: $("#comment-input").val(),
            user: localStorage.getItem("user"),
          }
        }).then(function() {
          $("#comment-list").append($("<div class='comment'><p class='comment-user'>" + localStorage.getItem("user") + "</p><p class='comment-text'>" + $("#comment-input").val() + "</p></div>"))
          $("#comment-input").val("");
        });
  }
})

$(document).on("click", "#back", function() {
    $("#active-article").empty();
    $("#comment-section").css("display", "none");
    $("#active-article").css("display", "none");
    $("#article-list").css("display", "block");
    $("#comment-list").empty();
});

$(document).on("click", "#scrape", function() {
  $.ajax({
    method: "GET",
    url: "/scrape/"
  });
})