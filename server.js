var express = require('express');
var request = require('request');
var querystring = require('querystring');

var app = express();

// This constant is the begingin of the URL that every get request uses for the spotify API. By making it a constant i was able to simplfy code by just using the suffix for my requests. 

const spotifyBaseUrl = 'https://api.spotify.com/v1/';

app.use(express.static(__dirname + '/'));

app.get('/user', function (req, res) {

    let token = req.query.token;

    let requestURL = spotifyBaseUrl + 'me';

    let options = {
        url: requestURL,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        json: true
    };

    request.get(options, function (error, response, body) {
        res.json(body);
        console.log(body);
    });
});

app.get('/search', function (req, res) {

    // Get token and remove from query object
    let token = req.query.token;
    delete req.query.token;


    let requestURL = spotifyBaseUrl + 'search?' +
        querystring.stringify({
            limit: req.query.limit,
            market: 'from_token'
        }) + '&' +
        querystring.stringify(req.query);


    let options = {
        url: requestURL,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        json: true
    };

    request.get(options, function (error, response, body) {
        res.json(body);
        console.log(body);
    });
});


app.get('/audio-features', function (req, res) {

    let ids = req.query.ids;
    let token = req.query.token;
    delete req.query.token;

    let requestURL = spotifyBaseUrl + 'audio-features?' +
        querystring.stringify({
            ids: ids,
            market: 'from_token'
        }) + '&' +
        querystring.stringify(req.query);

    let options = {
        url: requestURL,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        json: true
    };

    request.get(options, function (error, response, body) {
        res.json(body);
        console.log(body);
    });
});



app.get('/recommendations', function (req, res) {

    // Get token and remove from query object
    let token = req.query.token;
    delete req.query.token;

    let requestURL = spotifyBaseUrl + 'recommendations?' +
        querystring.stringify({
            limit: req.query.limit,
            market: 'from_token'
        }) + '&' +
        querystring.stringify(req.query);

    let options = {
        url: requestURL,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        json: true
    };

    request.get(options, function (error, response, body) {
        res.json(body);
        console.log(body);
    });
});




app.get('/tracks', function (req, res) {

    let ids = req.query.ids;
    let token = req.query.token;

    let requestURL = spotifyBaseUrl + 'tracks?' +
        querystring.stringify({
            ids: ids,
            market: 'from_token'
        });

    let options = {
        url: requestURL,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        json: true
    };

    request.get(options, function (error, response, body) {
        res.json(body.tracks);
    });
});

app.post('/playlist', function (req, res) {

    let tracks = req.query.tracks;
    let genres = req.query.genres;
    let token = req.query.token;
    let features = req.query.features;
    let userId, playlistUrl;


    let requestURL = spotifyBaseUrl + 'me';

    let options = {
        url: requestURL,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        json: true
    };

    request.get(options, function (error, response, body) {
        userId = body.id;

        requestURL = spotifyBaseUrl + 'users/' + userId + '/playlists';

        options = {
            url: requestURL,
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            json: true,
            dataType: 'json',
            body: {
                "name": "Sponline Tracks",
                "description": "Recommended tracks based on " + genres + " with " + features
            }
        };

        request.post(options, function (error, response, body) {
            playlistUrl = body.tracks.href;


            requestURL = playlistUrl + '/?' +
                querystring.stringify({
                    uris: tracks
                });

            options = {
                url: requestURL,
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                json: true
            };

            request.post(options, function (error, response, body) {
                res.sendStatus(200);
            });
        });
    });
});

console.log('Listening on 8080');
app.listen(8080);
