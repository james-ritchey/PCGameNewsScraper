// Create the required custom methods at the bottom of this file

var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var ArticleSchema = new Schema({
    title: {
        type: String,
        trim: true,
    },
    author: {
        type: String,
        trim: true,
    },
    synopsis: {
        type: String,
        trim: true,
    },
    link: {
        type: String,
        trim: true,
    },
    img: {
        type: String,
        trim: true,
    },
    scrapedDate:{
        type: Date,
        default: Date.now
    },
    notes: [
        {
            type: Schema.Types.ObjectId,
            ref: "Note"
        }
    ]
});


// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the User model
module.exports = Article;
