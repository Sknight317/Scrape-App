var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
// mongoose.plugin(schema => { schema.options.usePushEach = true });
const URI = require("./config/index");
require("./models");
//lets require/import the mongodb native drivers.
// var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
// var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.

//(Focus on This Variable)
// var url = 'mongodb://' + encodeURIComponent('${process.env.USERNAME}')+':'+encodeURIComponent('${process.env.PASSWORD}')+'@ds253094.mlab.com:53094/heroku_7gxhnzfj';    
// var url = process.env.MONGOLAB_URI;
// console.log(url)
// Use connect method to connect to the Server
  // MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
  // if (err) {
  //   console.log('Unable to connect to the mongoDB server. Error:', err);
  // } else {
  //   console.log('Connection established to', url);
    

    // do some work here with the database.

    //Close connection
//     db.close();
//   }
// });
// Requiring axios and cheerios
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");
// var dotenv = require('dotenv');
// dotenv.config(({path: __dirname + '/.env'}));

var PORT = process.env.PORT || 3000;

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
//Set handlebars
var exphbs  = require('express-handlebars');

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


var handlebars = require("handlebars");
handlebars.registerHelper("json", context => JSON.stringify(context));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database

// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// console.log("connection url: " + MONGODB_URI)
// console.log(MONGODB_URI)
// mongoose.Promise = Promise;

// mongoose.connect(MONGODB_URI , { useNewUrlParser: true });

mongoose.connect(process.env.MONGODB_URI || URI, { useNewUrlParser: true });

// When successfully connected
mongoose.connection.on('connected', () => {
	console.log('Established Mongoose Default Connection');
});

// When connection throws an error
mongoose.connection.on('error', err => {
	console.log('Mongoose Default Connection Error : ' + err);
});
// Routes

// A GET route for scraping the the Next web website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://thenextweb.com/dd/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("div.story.story--large").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
      .find("a").text()
      result.link = $(this)
      .find("a").attr("href")
      result.summary = $(this)
      .find("p.story-chunk").text().slice(0,200) + ("...")
      // result.image = $(this)
      // .find("a.lazy.story-image.LazyLoaded").attr("style")
      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
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

// Route for getting all saved Articles from the db
app.get("/saved", function (req, res) {
  
  db.Article.find({ saved: true }, function (err, result) {
    
    if (err) {
      console.log("Could not get saved articles: " + err);
    }
    
    else {
      
      res.render("saved", {
        articles: result,
      });
    }
  });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});


// Route for getting all unsaved articles from the db
  //this uses index.handlebars
  app.get("/", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({ }, function (err, result) {
      if (err) {
        console.log("Error: " + err);
      }
      else {
        res.render("index", {
          
          articles: result
      
        });
        console.log("Result:" + result);
      }
      });
});
// Route for getting all Articles from the db
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

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

//Route for updating an article's saved value from false to true
app.put("/savedarticles/:id", function (req, res) {
    
  db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true })
  .then(function (result) {
    console.log("This article has been saved");
    res.json(result);
    
  })
  .catch(function (err) {
    res.json(err);
    console.log("Error saving articles: " + err);
  });
});

app.delete("/articles/delete/:id", function (req, res) {
  db.Article.findOneAndRemove({ _id: req.params.id })
  .then(function (result) {
    console.log("This article has been deleted");
    res.json(result);
    
  })
  .catch(function (err) {
    res.json(err);
    console.log("Error deleting articles: " + err);
  });
});
// Start the server
app.listen(process.env.PORT || 3000, function() {
  console.log("App running on port " + PORT + "!");
});
