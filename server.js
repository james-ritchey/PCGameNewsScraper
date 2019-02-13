var scraper = require("./scrape");

// Add code to userModel.js to complete the model

var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/scrapedPCGamingArticles", { useNewUrlParser: true });

// Routes
app.get("/scrape", function(req, res){ 
  scraper.scrape(1);
  res.send("Scraped");
});

app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
