// const dotenv = require('dotenv');
// dotenv.config();
// Or more succintly:
require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + "/views/partials");

// setting the spotify-api goes here:

// the routes go here:
app.get('/', (req, res, next) => {
  res.render('index');
});


// return the URL for searched artists 
app.get('/artists', (req, res, next) => {
  // console.log(req.query);   //returns object e.g., { artist: 'artist name' }
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      res.render('artists', {artists: data.body.artists.items} );
    })
    .catch(err => {
      console.log('The error while searching artists occurred: ', err);
    });
  });


app.get('/:artist/albums', (req, res, next) => {
  console.log(req.params.artist);
  spotifyApi.getArtistAlbums(req.params.artist)
  .then(albums => {
    console.log(albums);
    res.render('albums', { albums: albums.body.items });
  })
  .catch(err => {
    console.log('The error while fetching albumns occurred: ', err);
  });
});


app.get('/albums/:album_id', (req, res, next) => {  
  spotifyApi.getArtistAlbums(req.params.album_id)
  .then(album => {
    console.log(album);
    // res.render('albums', { album: albums.body.items });
  })
  .catch(err => {
    console.log('The error while fetching albumns occurred: ', err);
  });
});




app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
