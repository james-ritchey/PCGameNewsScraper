// Using this template, the cheerio documentation,
// and what you've learned in class so far, scrape a website
// of your choice, save information from the page in a result array, and log it to the console.

var cheerio = require("cheerio");
var axios = require("axios");
var db = require("./models");
var results = [];
var Scraper = {
    scrape: function(page) {
        results = [];
        // Make a request via axios to grab the HTML body from the site of your choice
        axios.get("https://www.pcgamer.com/news/page/" + page).then(function(response) {

        // Load the HTML into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        var $ = cheerio.load(response.data);
        // An empty array to save the data that we'll scrape

        // Select each element in the HTML body from which you want information.
        // NOTE: Cheerio selectors function similarly to jQuery's selectors,
        // but be sure to visit the package's npm page to see how it works
        $("article.search-result-news").each(function(i, element) {

            var title = $(element).find("h3.article-name").text();

            var author = $(element).find("span.by-author").text();
            author = author.split("\n");
            author.forEach(function(item, index) {
                if(item === '') {
                    author.splice(index, 1);
                }
            });
            author = author.join(" ");

            var synopsis = $(element).find("p.synopsis").text();
            synopsis = synopsis.split("\n");
            synopsis.forEach(function(item, index) {
                if(item === '' || item.toLowerCase() === 'news') {
                    synopsis.splice(index, 1);
                }
            });
            synopsis = synopsis.join(" ");

            var link = $(element).parent("a").attr("href");
            var img = $(element).find("figure.article-lead-image-wrap").attr("data-original");

            // Save these results in an object that we'll push into the results array we defined earlier
            results.push({
                title: title,
                author: author,
                synopsis: synopsis,
                link: link,
                img: img
            });
        });
        }).then(function() {
            //console.log(results);
            results.forEach(function(item) {
                db.Article.find({
                    link: item.link,
                    title: item.title
                }).then(function(data) {
                    console.log("Looking for dupes");
                    console.log(data.length);
                    if(data.length === 0) {
                        db.Article.create(item).then(function(dbArticle) {
                            console.log(dbArticle);
                        });
                    }
                });
            });
        });
    }
}

module.exports = Scraper;