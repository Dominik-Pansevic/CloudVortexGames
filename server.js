// Set up
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const https = require("https");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// My Variables
const itchCollectionUrl = process.env.ITCH_URL;
let recentCoverImages = [];
let assetCollectionImages = [];

let itchLinks = [];


// Request Handling
app.get("/", function(req, res) {
  https.get(itchCollectionUrl, function(response) {
    response.on("data", function(data) {
      responseData = JSON.parse(data);

      recentCoverImages = [];
      itchLinks = [];

      recentCoverImages.push(responseData.games[0].cover_url);
      recentCoverImages.push(responseData.games[1].cover_url);

      itchLinks.push(responseData.games[0].url);
      itchLinks.push(responseData.games[1].url);


    });
  });

  res.render("index", {
    imgSource: recentCoverImages[0],
    imgSource2: recentCoverImages[1],
    itchLinks: itchLinks
  });


});

app.get("/collection", function(req, res) {
  https.get(itchCollectionUrl, function(response) {
    response.on("data", function(data) {
      responseData = JSON.parse(data);
      assetCollectionImages = [];
      itchLinks = [];

      for (var i = 0; i < responseData.games.length; i++) {
        assetCollectionImages.push(responseData.games[i].cover_url);
        itchLinks.push(responseData.games[i].url);
      }

    });
  });

  res.render("collection", {
    assetCollection: assetCollectionImages,
    itchLinks: itchLinks
  });

});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
