var scraper = require("./scraper");
require("dotenv").config();
// Add code to userModel.js to complete the model

var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var db = require("./models");

var PORT = 3030;

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

if(process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

}
else {
  // Connect to the Mongo DB
  mongoose.connect("mongodb://localhost/scrapedPCGamingArticles", { useNewUrlParser: true });
}


// Routes
app.get("/", function(req, res) {
  res.sendFile(__dirname + "./public/index.html");
})


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

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  var note = req.body;
  console.log(note);
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
  db.Note.create({
    body: note.body,
    user: note.user
  }).then(function(dbNote) {
    return db.Article.findOneAndUpdate({_id: req.params.id}, { $push: {notes: dbNote._id }}, { new: true });
  }).then(function(dbArticle) {
    res.json(dbArticle);
  }).catch(function(err) {
    res.json(err);
  });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // TODO
  // ====
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included
  db.Article.findOne({_id: req.params.id}).populate('notes').then(function(results){
      res.send(results);
      console.log(results);
  }).catch(function(err) {
    res.json(err);
  });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
